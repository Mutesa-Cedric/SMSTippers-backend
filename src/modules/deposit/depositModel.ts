import mongoose = require("mongoose");

const Deposit = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "successful", "failed"],
        default: "pending",
        required: true
    },
    payment_method: {
        type: String,
        enum: ["stripe", "cryptocurrency"],
        required: true,
    },
    payment_url: {
        type: String,
        required: false
    }
}, {
    timestamps: true
})

export default mongoose.model("deposit", Deposit);