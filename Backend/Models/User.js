const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  display_name:String,
  username: String,
  password: String,

});

module.exports = mongoose.model("User", UserSchema);
