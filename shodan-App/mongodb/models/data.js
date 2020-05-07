var mongoose = require('mongoose');

var data_schema =  mongoose.Schema({
  ip: String,
  ip_str: String,
  port : String,
  isp: String,
  pais: String,
  timestamp_shodan: Date,
  type: String,
  tried: Boolean,
  vulnerable: Boolean
}, {collection: 'data'});

module.exports =  mongoose.model('dataModel', data_schema);