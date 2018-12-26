const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const User = require("../models/user");

const Product = sequelize.define("product", {
	pid: {
		type: Sequelize.UUID,
		defaultValue: Sequelize.DataTypes.UUIDV1,
		primaryKey: true
	},
	name: {
		type: Sequelize.STRING,
		allowNull: false
	},
	type: {
		type: Sequelize.STRING,
		allowNull: false
	},
	image: {
		type: Sequelize.STRING,
		allowNull: false
	},
	fk_userid: {
		type: Sequelize.UUID,
		references: {
			model: User,
			key: "id"
		}
	}
});

module.exports = Product;