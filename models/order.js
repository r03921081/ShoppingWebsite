var mongoose = require("mongoose");

var OrderSchema = new mongoose.Schema({
	buyer: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		buyerName: String
	},
	commodity: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Commodity"
		},
		commidityName: String
	},
	quantity: String,
	amount: String,
	payment: String, /* Cash with Order(CWO), Letter of Credit(LC) */
	deliveryDate: {
		type: Date,
		default: Date.now
	}
}, {
	timestamps: true
});

module.exports = mongoose.model("Order", OrderSchema);
