const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  action: String,
  name: String,
  coordinates: {
    lat: Number,
    lng: Number
  },
  visitDate: Date,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('History', historySchema);