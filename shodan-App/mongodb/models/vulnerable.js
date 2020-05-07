var mongoose = require('mongoose');

var vulnerable_schema =  mongoose.Schema({
  ip: String,
  ip_str: String,
  port : String,
  id_device:  {type: mongoose.Schema.Types.ObjectId},
  type: String,
  user: String,
  pass: String
}, {collection: 'vulnerable'});

module.exports =  mongoose.model('vulnerableModel', vulnerable_schema);