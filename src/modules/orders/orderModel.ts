import mongoose = require("mongoose");

const Order = new mongoose.Schema({
    order_id: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    service_id: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    expires_in: {
        type: Number,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
}, {
    timestamps: true
});

export default mongoose.model("order", Order);