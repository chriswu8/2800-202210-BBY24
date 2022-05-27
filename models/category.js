const mongoose = require('mongoose');

// page schema
const CategorySchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    }
});

const Category = module.exports = mongoose.model('Category', CategorySchema);
