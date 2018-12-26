const express = require("express");
const app = express();
const sequelize = require("./util/database");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");

const indexRoutes = require("./routes/index");
const productsRoutes = require("./routes/products");
const commentsRoutes = require("./routes/comments");
const errorController = require("./controllers/error");

const myPassport = require("./util/passport");
const User = require("./models/user");

app.locals.moment = require("moment");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

app.use((req, res, next) => {
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

app.use(session({ 
	secret: "MySecretKey",
	resave: true,
	saveUninitialized:true
})); 
app.use(passport.initialize()); 
app.use(passport.session());
myPassport(passport, User);

app.use(indexRoutes.routes);
app.use("/products", productsRoutes.routes);
app.use("/products", commentsRoutes.routes);
app.use(errorController.get404);

sequelize
	.sync({force: true})
	// .sync()
	.then(() => {
		app.listen(3000, () => {
			console.log("Server is running.");
		});
	})
	.catch(err => {
		console.log(err);
	});