var express = require("express");
var app = express();
var mongoose = require("mongoose");


var Commodity = require("./models/commodity");
var User = require("./models/user");

app.use("view engine", "ejs");



app.listen(3030, "localhost", function(){
	console.log("Server si running.");
});