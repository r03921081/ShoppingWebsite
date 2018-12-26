const Sequelize = require("sequelize");

const sequelize = new Sequelize("myshop", "root", "1qaz@WSX", {
    dialect: "mysql",
    host: "localhost",
    timezone: "+08:00"
});

module.exports = sequelize;