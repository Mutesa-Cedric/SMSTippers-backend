import mongoose = require("mongoose");

const Rental = new mongoose.Schema({
    rental_id: {
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
        type: String
    },
    days: {
        type: Number,
        required: true,
        enum: [7, 14, 30,]
    },
    expiry: {
        type: Number,
        required: true
    },
}, {
    timestamps: true
});

export default mongoose.model("rental", Rental);