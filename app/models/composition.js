// Load modules
var mongoose = require('mongoose');

// Define the Schema
var compositionSchema = mongoose.Schema({
    owner_id: String,
    title: String,
    content: String
});

// Export the module
module.exports = mongoose.model('Composition', compositionSchema);