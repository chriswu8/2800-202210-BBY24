const { default: mongoose } = require("mongoose");
const { boolean } = require("webidl-conversions");

const schema = mongoose.Schema;
const userSchema = new schema({
    name: {
        type: String,
        required: true
    },

    number: {
        type: Number,
        required: true
    },

    email: {
        type: String,
        unique: true,
        required: true
    },

    password: {
        type: String,
        unique: true,
        required: true
    }

    // admin: {
    //     type: Boolean,
    //     unique: true,
    //     required: true
    // }
});

// users is the collection name
module.exports = mongoose.model('users', userSchema);