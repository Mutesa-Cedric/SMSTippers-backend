import mongoose = require("mongoose");


const EarnedFromReferrals = new mongoose.Schema({
    earnedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    reason: {
        type: String,
        required: true,
        enum: ['order', 'rent']
    }
}, {
    timestamps: true
});

export default mongoose.model("earnedFromReferrals", EarnedFromReferrals);