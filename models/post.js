const mongoose = require('mongoose');

const schema  = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true
    }
}, {timestamps: true});

const Post = module.exports = mongoose.model('Post', schema);