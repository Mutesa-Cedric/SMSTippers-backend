import { Request, Response } from "express";
import User from "../user/userModel";

export const createReferral = async (req: Request, res: Response) => {
    try {
        const { promoCode, userId } = req.body;

        if (!userId || !promoCode) return res.status(400).json({ message: "No user id provided!" });
        if (!promoCode) {
            return res.status(400).json({ message: "No promo code provided!" });
        }
        const referredBy = await User.findOne({
            promoCode: promoCode
        });
        if (!referredBy) {
            return res.status(400).json({ message: "Invalid promo code!" });
        }
        referredBy.referrals.push(userId);
        await referredBy.save();

        const referredUser = await User.findById(userId);
        if (!referredUser) return res.status(400).json({ message: "Invalid user id!" });
        referredUser.referredBy = referredBy._id;
        await referredUser.save();

        res.status(200).json({ message: "Referral created successfully!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getReferrals = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;
        if (!userId) return res.status(400).json({ message: "No user id provided!" });

        const user = await User.findById(userId).populate("referrals");

        if (!user) return res.status(400).json({ message: "Invalid user id!" });

        res.status(200).json({ referrals: user.referrals });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
