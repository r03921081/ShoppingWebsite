const express = require("express");
const app = express();
const sequelize = require("./util/database");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const flash = require("connect-flash");
const csrf = require("csurf");

const indexRoutes = require("./routes/index");
const productsRoutes = require("./routes/products");
const commentsRoutes = require("./routes/comments");
const errorController = require("./controllers/error");

const myPassport = require("./util/passport");
const association = require("./util/association");

const User = require("./models/user");

app.locals.moment = require("moment");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
const csrfProtection = csrf();

app.use(session({ 
	secret: "MySecretKey",
	resave: true,
	saveUninitialized:true
})); 
app.use(passport.initialize()); 
app.use(passport.session());
myPassport(passport, User);
app.use(flash());
app.use(csrfProtection);

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.csrfToken = req.csrfToken();
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");

	if(req.user !== undefined){
		console.log(req.user);
		User.findByPk(req.user.id)
		.then(u => {
			req.user = u;
			next();
		})
		.catch(err => console.log(err));
	}
	else{
		console.log("Guest");
		next();
	}
});

app.use(indexRoutes.routes);
app.use(productsRoutes.routes);
app.use(commentsRoutes.routes);
app.use(errorController.get404);

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