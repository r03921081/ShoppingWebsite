var mongoose = require("mongoose");

var commoditySchema = new mongoose.Schema({
	name: String,
	type: String,
	image: String,
	specification: String,
	description: String,
	descriptionDetailed: String,
	quantity: String,
	price: String,
	discount: String,
	discountDealine: String,
	createDate: {
		type: Date,
		default: Date.now,
	},
	seller: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		sellerName: String
	},
	comments: [
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
}, {
		timestamps: true
});

module.exports = mongoose.model("Commodity", commoditySchema);