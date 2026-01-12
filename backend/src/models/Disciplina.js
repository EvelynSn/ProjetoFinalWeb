const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = sequelize.define("Disciplina", {
  nome: DataTypes.STRING,
  horas: DataTypes.STRING
});
