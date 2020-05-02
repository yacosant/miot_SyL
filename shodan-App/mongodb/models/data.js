var mongoose = require('mongoose');

var data_schema =  mongoose.Schema({
  ip: String,
  ip_str: String,
  port : String,
  isp: String,
  timestamp_shodan: Number,
  tried: Boolean,
  vulnerable: Boolean
}, {collection: 'data'});

module.exports =  mongoose.model('dataModel', data_schema);