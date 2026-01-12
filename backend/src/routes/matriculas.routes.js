const express = require("express");
const router = express.Router();
const { Matricula, Aluno, Turma } = require("../models");

const sequelize = require("../config/database");



router.get("/", async (req, res) => {
  const matriculas = await Matricula.findAll({
    include: [
      {
        model: Aluno,
        attributes: ["id", "nome", "matricula"],
      },
      {
        model: Turma,
        attributes: ["id", "semestre", "horario"],
      },
    ],
  });

  res.json(matriculas);
});

// realizar matrícula
router.post("/", async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { alunoId, turmaId } = req.body;

    const turma = await Turma.findByPk(turmaId, { transaction });

    if (!turma) {
      await transaction.rollback();
      return res.status(404).json({ error: "Turma não encontrada" });
    }

    if (turma.vagasDisponiveis <= 0) {
      await transaction.rollback();
      return res.status(400).json({ error: "Turma sem vagas disponíveis" });
    }

    const jaMatriculado = await Matricula.findOne({
      where: {
        AlunoId: alunoId,
        TurmaId: turmaId,
        status: "ATIVA",
      },
      transaction,
    });

    if (jaMatriculado) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ error: "Aluno já matriculado nesta turma" });
    }

    const matricula = await Matricula.create(
      {
        AlunoId: alunoId,
        TurmaId: turmaId,
        status: "ATIVA",
      },
      { transaction }
    );

    turma.vagasDisponiveis = turma.vagasDisponiveis - 1;
    await turma.save({ transaction });

    await transaction.commit();

    res.status(201).json(matricula);
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.status(500).json({ error: "Erro ao realizar matrícula" });
  }
});

// cancelar matrícula
router.put("/:id/cancelar", async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const matricula = await Matricula.findByPk(req.params.id, {
      include: Turma,
      transaction,
    });

    if (!matricula || matricula.status !== "ATIVA") {
      await transaction.rollback();
      return res.status(404).json({ error: "Matrícula não encontrada" });
    }

    matricula.status = "CANCELADA";
    await matricula.save({ transaction });

    matricula.Turma.vagasDisponiveis += 1;
    await matricula.Turma.save({ transaction });

    await transaction.commit();
    res.sendStatus(200);
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.status(500).json({ error: "Erro ao cancelar matrícula" });
  }
});

module.exports = router;
