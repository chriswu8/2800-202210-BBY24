const mongoose = require('mongoose');

const postingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    author: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    dateCreated: {
        type: Date,
        default: Date.now()
    },

    img: {
        type: String,
        default: "dummy.jpg"
    }
});

// make reference to postingSchema via Posting (in postingRounter.js)
module.exports = mongoose.model('Posting', postingSchema)