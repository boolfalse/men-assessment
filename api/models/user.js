
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    isAdmin: {
        type: Boolean,
        default: false,
    },
    name: {
        type: String,
        required: [true, 'Name is required!'],
    },
    email: {
        type: String,
        required: [true, 'Email is required!'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required!'],
    },
}, {
    timestamps: true,
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
