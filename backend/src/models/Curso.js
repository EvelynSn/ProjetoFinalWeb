const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = sequelize.define("Curso", {
  nome: DataTypes.STRING,
  codigo: DataTypes.STRING,
  horas: DataTypes.STRING
});
