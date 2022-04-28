const mongoose = require('mongoose');
const { Schema } = require('mongoose');


// Define Schema
const studySchema = new mongoose.Schema({
    name : {
        type: String,
        unique: true,
        required: true
    },
    meetingStartDate : {
        type: String
    },
    meetingEndDate : {
        type: String
    },
    meetingCycle : {
        type: String
    },
    meetingTime : {
        type: String
    },
    members : [{
        type: Schema.Types.ObjectId
    }]
},
{
    timestamps: true
});

// Create Model & Export
module.exports = mongoose.model('Study', studySchema);