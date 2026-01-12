const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Aluno = sequelize.define("Aluno", {
  nome: DataTypes.STRING,
  matricula: DataTypes.STRING,
  email: DataTypes.STRING,
  curso_id: DataTypes.STRING,
});

Aluno.associate = (models) => {
  Aluno.hasMany(models.Matricula);
};

module.exports = Aluno;
