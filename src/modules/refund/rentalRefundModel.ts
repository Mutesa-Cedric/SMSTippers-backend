import mongoose = require("mongoose");

const RentalRefund = new mongoose.Schema({
    rental: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "rental",
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

export default mongoose.model("rental-refund", RentalRefund);