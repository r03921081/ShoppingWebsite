const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const User = sequelize.define("user", {
	id: {
		type: Sequelize.UUID,
		defaultValue: Sequelize.DataTypes.UUIDV1,
		primaryKey: true
	},
	username: {
		type: Sequelize.STRING,
		unique: true,
		allowNull: false
	},
	email: {
		type: Sequelize.STRING,
		unique: true,
		validate: {
			isEmail: true
		}
	},
	password: {
		type: Sequelize.STRING,
		allowNull: false
	},
	last_login: {
		type: Sequelize.DATE,
	},
	status: {
		type: Sequelize.ENUM,
		values: ["guest", "unchecked", "active", "blocked", "deleted"],
		defaultValue: "guest"
	},
	blockedExpiration: {
		type: Sequelize.DATE
	},
	resetToken: {
		type: Sequelize.STRING
	},
	resetTokenExpiration: {
		type: Sequelize.DATE
	}
});

module.exports = User;