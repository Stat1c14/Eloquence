var mongoose = require('mongoose');

var compositionSchema = mongoose.Schema({
    owner_id: String,
    title: String,
    content: String
});

module.exports = mongoose.model('Composition', compositionSchema);