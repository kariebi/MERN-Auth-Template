const mongoose = require('mongoose')
const { Schema } = mongoose

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
    password: String,
})

const UserModel = mongoose.model('User', UserSchema)

module.exports = UserModel