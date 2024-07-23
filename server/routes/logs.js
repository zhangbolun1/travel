const express = require('express');
const Log = require('../models/Log');
const router = express.Router();

router.get('/', async (req, res) => {
  const logs = await Log.find();
  res.json(logs);
});

module.exports = router;