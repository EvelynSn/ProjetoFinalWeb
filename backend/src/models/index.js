const Aluno = require("./Aluno");
const Professor = require("./Professor");
const Curso = require("./Curso");
const Disciplina = require("./Disciplina");
const Turma = require("./Turma");
const Matricula = require("./Matricula");

// Curso → Turma
Curso.hasMany(Turma);
Turma.belongsTo(Curso);

// Turma → Disciplina
Disciplina.hasMany(Turma);
Turma.belongsTo(Disciplina);

// Professor → Turma
Professor.hasMany(Turma);
Turma.belongsTo(Professor);

// Aluno → Matricula
Aluno.hasMany(Matricula);
Matricula.belongsTo(Aluno);

// Turma → Matricula
Turma.hasMany(Matricula);
Matricula.belongsTo(Turma);

module.exports = {
  Aluno,
  Professor,
  Curso,
  Disciplina,
  Turma,
  Matricula
};
