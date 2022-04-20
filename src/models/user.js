const mongoose = require('mongoose');

// Define Schema
const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    discord: {
        type: String,
        required: true
    },
    github : {
        type: String,
        required: true
    },
    notion : {
        type: String,
        required: true
    }
},
{
    timestamps: true
});

// Create Model & Export
module.exports = mongoose.model('User', userSchema);