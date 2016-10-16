// Load required packages
var mongoose = require('mongoose');

// Define our Thing schema
// var thingSchema   = new mongoose.Schema({
//   name: String,
//   type: String,
//   location: String
// });

// Export the Mongoose model
module.exports = mongoose.model('Thing', thingSchema);
