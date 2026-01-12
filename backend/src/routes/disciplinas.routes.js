const express = require("express");
const { Disciplina } = require("../models");
const router = express.Router();

router.get("/", async (_, res) =>
  res.json(await Disciplina.findAll())
);

router.get("/:id", async (req, res) =>
  res.json(await Disciplina.findByPk(req.params.id))
);

router.post("/", async (req, res) =>
  res.json(await Disciplina.create(req.body))
);

router.put("/:id", async (req, res) => {
  await Disciplina.update(req.body, {
    where: { id: req.params.id }
  });
  res.sendStatus(200);
});

router.delete("/:id", async (req, res) => {
  await Disciplina.destroy({
    where: { id: req.params.id }
  });
  res.sendStatus(200);
});

module.exports = router;
