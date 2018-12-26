const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const User = require("../models/user");
const Product = require("../models/product");

const Comment = sequelize.define("comment", {
	cid: {
		type: Sequelize.UUID,
		defaultValue: Sequelize.DataTypes.UUIDV1,
		primaryKey: true
	},
	text: {
		type: Sequelize.STRING,
		allowNull: false
	},
	fk_userid: {
		type: Sequelize.UUID,
		references: {
			model: User,
			key: "id"
		}
	},
	fk_prodid: {
		type: Sequelize.UUID,
		references: {
			model: Product,
			key: "pid"
		}
	}
});

module.exports = Comment;
