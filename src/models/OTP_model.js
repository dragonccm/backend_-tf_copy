const mongoose = require('mongoose');
const { Schema } = mongoose;

const OtpSchema = new Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    otp: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
   
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
OtpSchema.index({ "createdAt": 1 }, { expireAfterSeconds: 180 });
const Otp = mongoose.model('Otp', OtpSchema);

module.exports = Otp;