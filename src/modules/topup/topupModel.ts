import mongoose = require("mongoose");

const Topup = new mongoose.Schema({
    amount: {
        type: Number,
        required: [true, 'amount is required']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['pending', 'success', 'failed'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['paypal', 'stripe', 'crypto'],
        require: [true, 'paymentMethod is required']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

export default mongoose.model("topup", Topup);
