'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Requests = new Schema({
    booksRequested: [{type: Schema.Types.ObjectId, ref: 'Books'}],
    from : {type: Schema.Types.ObjectId, ref: 'User'},
    booksOffered: [{type: Schema.Types.ObjectId, ref: 'Books'}],
    to : {type: Schema.Types.ObjectId, ref: 'User'}
});


module.exports = mongoose.model('Requests', Requests);