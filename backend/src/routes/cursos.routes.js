const express = require("express");
const { Curso } = require("../models");
const router = express.Router();

router.get("/", async (_, res) =>
  res.json(await Curso.findAll())
);

router.get("/:id", async (req, res) =>
  res.json(await Curso.findByPk(req.params.id))
);

router.post("/", async (req, res) =>
  res.json(await Curso.create(req.body))
);

router.put("/:id", async (req, res) => {
  await Curso.update(req.body, {
    where: { id: req.params.id }
  });
  res.sendStatus(200);
});

router.delete("/:id", async (req, res) => {
  await Curso.destroy({
    where: { id: req.params.id }
  });
  res.sendStatus(200);
});

module.exports = router;
