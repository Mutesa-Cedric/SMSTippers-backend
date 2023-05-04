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
    service: {
        type: String
    },
    days: {
        type: Number,
        required: true,
    },
    expiry: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    country: {
        type: String,
        require: true
    }
}, {
    timestamps: true
});

export default mongoose.model("rental", Rental);