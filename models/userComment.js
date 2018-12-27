const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const UserComment = sequelize.define("userComment", {
	cid: {
		type: Sequelize.UUID,
		defaultValue: Sequelize.DataTypes.UUIDV1,
		primaryKey: true
	},
	text: {
		type: Sequelize.STRING,
		allowNull: false
	}
});

module.exports = UserComment;
