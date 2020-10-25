const mongoose = require('mongoose');

const schema   = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
}, {timestamps: true});

const User = module.exports = mongoose.model('User', schema);