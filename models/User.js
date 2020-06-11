const mongoose = require("mongoose")
mongoose.set('useFindAndModify', false)
const Schema = mongoose.Schema

const UserSchema = new Schema({
  account: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

module.exports = User = mongoose.model("users", UserSchema)