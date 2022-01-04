const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Business
let Img = new Schema({
    gallery: String,
    path: Array
});

module.exports = mongoose.model('Collection', Img);