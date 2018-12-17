var mongoose = require("mongoose");

var reviewSchema = new mongoose.Schema({
	rating: {
		type: Number,
		required: "Please provide a rating (1-5 stars).",
		min: 1,
		max: 5,
		validate: {
			validator: Number.isInteger,
			message: "{VALUE} is not an integer value."
		}
	},
	text: String,
	commenter: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	commodity: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Commodity"
	}
}, {
		timestamps: true
});

module.exports = mongoose.model("Review", reviewSchema);