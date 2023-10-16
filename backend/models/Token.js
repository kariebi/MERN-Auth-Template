const mongoose = require('mongoose');
const { Schema } = mongoose;

const TokenSchema = new Schema({
    userId: {
        type: String,
        ref: 'user',
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    expiredAt: {
        type: Date,
        default: () => new Date(Date.now() + 5 * 60000), // 5 minutes from now
    },
    expired: {
        type: Boolean,
        default: false,
    },
});

const TokenModel = mongoose.model('Token', TokenSchema);

module.exports = TokenModel;
