const express = require("express");
const { Turma, Matricula, Aluno } = require("../models");
const router = express.Router();

router.get("/", async (_, res) => res.json(await Turma.findAll()));

router.get("/:id", async (req, res) =>
  res.json(await Turma.findByPk(req.params.id))
);

router.post("/", async (req, res) => {
  try {
    const {
      semestre,
      horario,
      vagasTotal,
      CursoId,
      DisciplinaId,
      ProfessorId,
    } = req.body;

    const turma = await Turma.create({
      semestre,
      horario,
      vagasTotal,
      vagasDisponiveis: vagasTotal,
      CursoId,
      DisciplinaId,
      ProfessorId,
    });

    res.status(201).json(turma);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar turma" });
  }
});

router.put("/:id", async (req, res) => {
  await Turma.update(req.body, {
    where: { id: req.params.id },
  });
  res.sendStatus(200);
});

// 🔥 REQUISITO: lista de alunos por turma
router.get("/:id/alunos", async (req, res) => {
  const turma = await Turma.findByPk(req.params.id, {
    include: {
      model: Matricula,
      include: [Aluno],
    },
  });
  res.json(turma);
});

router.delete("/:id", async (req, res) => {
  await Turma.destroy({
    where: { id: req.params.id },
  });
  res.sendStatus(200);
});

module.exports = router;
