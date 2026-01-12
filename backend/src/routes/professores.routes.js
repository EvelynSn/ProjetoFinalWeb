const express = require("express");
const { Professor } = require("../models");
const router = express.Router();

router.get("/", async (_, res) => res.json(await Professor.findAll()));

router.get("/:id", async (req, res) =>
  res.json(await Professor.findByPk(req.params.id))
);

router.post("/", async (req, res) =>
  res.json(await Professor.create(req.body))
);

router.put("/:id", async (req, res) => {
  await Professor.update(req.body, {
    where: { id: req.params.id },
  });
  res.sendStatus(200);
});

router.delete("/:id", async (req, res) => {
  await Professor.destroy({
    where: { id: req.params.id },
  });
  res.sendStatus(200);
});

module.exports = router;
