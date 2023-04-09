import mongoose = require("mongoose");

export const Ticket = new mongoose.Schema({
    ticket_id: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true,
        min: [2, "title too short"],
        max: [25, "title too long"]
    },
    description: {
        type: String,
        required: true,
        min: [2, "description too short"],
        max: [100, "description too long"]
    },
    status: {
        type: String,
        required: true,
        enum: ["open", "closed"],
        default: "open"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("ticket", Ticket);