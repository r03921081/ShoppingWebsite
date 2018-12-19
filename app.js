var express 		= require("express");
var app 			= express();
var mongoose 		= require("mongoose"),
	passport 		= require("passport"),
	localStrategy 	= require("passport-local"),
	methodOverride 	= require("method-override"),
	bodyParser 		=  require("body-parser");

app.locals.moment = require("moment");

var User 			= require("./models/user"),
	Commodity 		= require("./models/commodity"),
	Comment 		= require("./models/comment"),
	Transaction 	= require("./models/order"),
	Review 			= require("./models/review");

mongoose.connect("mongodb://localhost:27017/shop", {useNewUrlParser: true});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

app.use(require("express-session")({
	secret: "MySecretKey",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});

app.get("/", function(req, res){
	res.render("landing");
});

app.listen(3000, function(){
	console.log("Server is running.");
});