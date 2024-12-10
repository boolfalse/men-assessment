
const mongoose = require('mongoose');
const staticData = require('../config/static-data');

const linkSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // the user who created the link
    },
    referral_key: {
        type: String,
        unique: true,
        default: () => {
            let key = '';
            const characters = '0123456789abcdef';
            for (let i = 0; i < staticData.referral_key_length; i++) {
                key += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return key;
        },
    }
}, {
    timestamps: true,
});

module.exports = mongoose.models.Link || mongoose.model('Link', linkSchema);
