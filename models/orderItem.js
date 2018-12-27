const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const OrderItem = sequelize.define("orderItem", {
	id: {
		type: Sequelize.UUID,
		defaultValue: Sequelize.DataTypes.UUIDV1,
		primaryKey: true
	},
	quantity: {
		type: Sequelize.INTEGER,
		allowNull: false
	}
});

module.exports = OrderItem;
