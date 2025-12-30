import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: false,
    },
    image: {
        type: String,
        default: '',
    },
    phone: {
        type: String,
        default: '',
    },
    role: {
        type: String,
        default: 'user', // user, admin
    },
    resetToken: String,
    resetTokenExpiry: Date,
    otp: String,
    otpExpiry: Date,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
