const mongoose = require('mongoose');
const { Schema } = mongoose;

//Token for useremail verification
const TokenSchema = new Schema({
    email: {
        type: String,
        ref: 'user',
        required: true,
        unique: true
    },
    token: {
        type: String,
        required: true,
    },
    purpose: {
        type: String, //either 'email' or 'forgotpassword'
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 5 * 60000), // 5 minutes from now
    }
});

const TokenModel = mongoose.model('Token', TokenSchema);

module.exports = TokenModel;
