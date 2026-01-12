const express = require("express");
const { Aluno } = require("../models");
const router = express.Router();

router.get("/", async (_, res) => res.json(await Aluno.findAll()));

router.get("/:id", async (req, res) =>
  res.json(await Aluno.findByPk(req.params.id))
);

router.post("/", async (req, res) =>
  res.json(await Aluno.create(req.body))
);

router.put("/:id", async (req, res) => {
  await Aluno.update(req.body, { where: { id: req.params.id } });
  res.sendStatus(200);
});

router.delete("/:id", async (req, res) => {
  await Aluno.destroy({ where: { id: req.params.id } });
  res.sendStatus(200);
});

module.exports = router;
