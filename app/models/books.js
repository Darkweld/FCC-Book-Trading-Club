'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Books = new Schema({
    bookId: String,
    title: String,
    authors: Array,
    image: String,
    user : {type: Schema.Types.ObjectId, ref: 'User' }
});


module.exports = mongoose.model('Books', Books);