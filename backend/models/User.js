const mongoose = require('mongoose')
const { Schema } = mongoose

//User model
const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true
    },
    roles: {
        type: [String],
        default: ["User"]
    },
    active: {
        type: Boolean,
        default: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    password: String,
    isGoogleUser: {
        type: Boolean,
        default: false
    }
})

const UserModel = mongoose.model('User', UserSchema)

module.exports = UserModel