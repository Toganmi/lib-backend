const mongoose = require("mongoose")
const Schema = mongoose.Schema
const moment = require("moment")
moment.locale('zh-cn')



const ProfileSchema = new Schema({
  build: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: "等待审核"
  },
  name: {
    type: String
  },
  no: {
    type: String,
    required: true
  },
  createTime: {
    type: Date,
    default: Date.now
  }
})

module.exports = Profile = mongoose.model("profile", ProfileSchema)