const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Machine = new Schema({
  macA: String,
  osType: String,
  upTime: Number,
  freeMem: String,
  totalMem: Number,
  usedMem: Number,
  memUsage: Number,
  cpuModel: String,
  cpuSpeed: Number,
  numCors: Number,
  cpuLoad: Number,
})

module.exports = mongoose.model('Machine', Machine)