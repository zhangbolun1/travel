const express = require('express');
const router = express.Router();
const History = require('../models/History');

router.get('/', async (req, res) => {
  try {
    const { name, visitDate } = req.query;
    const query = {};
    if (name) {
      query.locationName = new RegExp(name, 'i'); // 搜索名称（忽略大小写）
    }
    if (visitDate) {
      const startDate = new Date(visitDate);
      const endDate = new Date(visitDate);
      endDate.setDate(endDate.getDate() + 1); // 包含选定日期的所有记录
      query.visitDate = { $gte: startDate, $lt: endDate };
    }
    const history = await History.find(query).sort({ timestamp: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;