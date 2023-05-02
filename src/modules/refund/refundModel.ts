import mongoose = require("mongoose");

const Refund = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "order",
        unique: true
    },
    rental: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "rental",
        unique: true
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

export default mongoose.model("refund", Refund);