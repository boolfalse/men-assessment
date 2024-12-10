
const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // the registered user
    },
    link: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Link', // the link that was used
    },
}, {
    timestamps: true,
});

module.exports = mongoose.models.Referral || mongoose.model('Referral', referralSchema);
