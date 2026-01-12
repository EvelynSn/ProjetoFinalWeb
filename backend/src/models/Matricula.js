const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Matricula = sequelize.define("Matricula", {
  status: DataTypes.STRING,
});

Matricula.associate = (models) => {
  Matricula.belongsTo(models.Aluno);
  Matricula.belongsTo(models.Turma);
};

module.exports = Matricula;
