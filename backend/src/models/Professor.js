const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = sequelize.define("Professor", {
  nome: DataTypes.STRING,
  siape: DataTypes.STRING,
  departamento: DataTypes.STRING,
  email: DataTypes.STRING
});
