import mongoose = require("mongoose");

const OrderRefund = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "order",
        unique: true,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    price: {
        type: Number,
        required: true
    }
},
    {
        timestamps: true
    })

export default mongoose.model("order-refund", OrderRefund);