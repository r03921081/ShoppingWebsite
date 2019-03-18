const express = require("express");
const app = express();
const sequelize = require("./util/database");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const flash = require("connect-flash-plus");
const csrf = require("csurf");
const multer = require("multer");

const indexRoutes = require("./routes/index");
const productsRoutes = require("./routes/products");
const commentsRoutes = require("./routes/comments");
const errorController = require("./controllers/error");

const myPassport = require("./util/passport");
const association = require("./util/association");

const User = require("./models/user");

// app.locals.moment = require("moment");
const csrfProtection = csrf();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
app.use("/images", express.static(__dirname + "/images"));
app.use(methodOverride("_method"));
app.use(flash());

const fileStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "images");
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname + "_" + Date.now().toString());
	}
});

const fileFilter = (req, file, cb) => {
	if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
		cb(null, true);
	}
	else {
		cb(null, false);
	}
};
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single("image"));

app.use(session({
	secret: "MySecretKey",
	resave: true,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
myPassport(passport, User);
app.use(csrfProtection);


app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.csrfToken = req.csrfToken();
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");

	if (req.user !== undefined) {
		// console.log(req.user);
		User.findByPk(req.user.id)
			.then(u => {
				req.user = u;
				next();
			})
			.catch(err => console.log(err));
	}
	else {
		console.log("Guest");
		next();
	}
});


app.use(indexRoutes.routes);
app.use(productsRoutes.routes);
app.use(commentsRoutes.routes);
app.use(errorController.get404);

app.use((error, req, res, next) => {
	res.status(500).render("500", {
		pageTitle: error
	});
});

sequelize
	// .sync({force: true})
	.sync()
	.then(() => {
		app.listen(3000, () => {
			console.log("Server is running.");
		});
	})
	.catch(err => {
		console.log(err);
	});