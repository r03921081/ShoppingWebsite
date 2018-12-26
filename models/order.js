const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const User = require("../models/user");
const Product = require("./product");

const Order = sequelize.define("order", {
	id: {
		type: Sequelize.UUID,
		defaultValue: Sequelize.DataTypes.UUIDV1,
		primaryKey: true
	},
	buyer: {
		type: Sequelize.INTEGER,
		references: {
			model: User,
			key: "id"
		}
	},
	product: {
		type: Sequelize.INTEGER,
		references: {
			model: Product,
			key: "id"
		}
	},
	quantity: {
		type: Sequelize.INTEGER,
		allowNull: false
	},
	amount: {
		type: Sequelize.INTEGER,
		allowNull: false
	},
	payment: {
		type: Sequelize.STRING,
		allowNull: false
	},
	deliveryDate: {
		type: Sequelize.DATE,
		defaultValue: Sequelize.DATE.now
	}
});

module.exports = Order;
