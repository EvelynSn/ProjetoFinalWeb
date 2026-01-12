
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/login', (req,res)=>{
  const token = jwt.sign({ user:'admin' }, 'segredo');
  res.json({ token });
});

module.exports = router;
