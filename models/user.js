const { default: mongoose } = require("mongoose");
const { boolean } = require("webidl-conversions");

const schema = mongoose.Schema;
const userSchema = new schema({
    name: {
        type: String,
        required: true
    },

    number: {
        type: String,
        required: true
    },

    email: {
        type: String,
        unique: true,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    image: {
        type: String,
        default:'/css/img/profile.png',
        required: false,
    },
    
    created: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

// users is the collection name
module.exports = mongoose.model('users', userSchema);