var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
	username: String,
	password: String,
	status: String,
	isblocked: String,
	isDeleted: String
}, {
		timestamps: true
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);