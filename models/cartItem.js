const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const CartItem = sequelize.define("cartItem", {
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

module.exports = CartItem;
