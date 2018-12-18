var mongoose = require("mongoose");

var OrderSchema = new mongoose.Schema({
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
	Quantity: String,
	Amount: String,
	payment: String, /* Cash with Order(CWO), Letter of Credit(LC) */
	deliveryDate: Date
}, {
		timestamps: true
});

module.exports = mongoose.model("Order", OrderSchema);
