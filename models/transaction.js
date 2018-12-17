var mongoose = require("mongoose");

var transactionSchema = new mongoose.Schema({
	buyer: {
		id: {
			type.mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		buyerName: String
	}
	commodity: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Commodity"
		},
		commidityName: String
	},
	tQuantity: String,
	tAmount: String,
	payment: String
}, {
		timestamps: true
});

module.exports = mongoose.model("Transaction", transactionSchema)
