const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Turma = sequelize.define("Turma", {
  semestre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  horario: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  vagasTotal: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  vagasDisponiveis: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Turma.associate = (models) => {
  Turma.hasMany(models.Matricula);
};

module.exports = Turma;
