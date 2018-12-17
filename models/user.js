var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
	userName: String,
	password: String,
	state: String,
	block: String,
	isDeleted: String
}, {
		timestamps: true
});

module.exports = mongoose.model("User", userSchema);