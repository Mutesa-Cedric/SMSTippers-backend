import { Request, Response } from "express";
import User from "../user/userModel";
import { verifyToken } from "../../utils/jwt";
import EarnedFromReferrals from "../referrals/earnedFromReferralsModel";

export const createReferral = async (req: Request, res: Response) => {
    console.log("create referral was hit");
    try {
        const { promoCode, userId } = req.body;

        if (!userId || !promoCode || typeof userId === undefined) return res.status(400).json({ message: "No user id provided!" });
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
        const { userId } = req.query;
        if (!userId) return res.status(400).json({ message: "No user id provided!" });

        const user = await User.findById(userId).populate("referrals").sort({ createdAt: -1 });


        if (!user) return res.status(400).json({ message: "Invalid user id!" });

        // remove password,apiKey,promoCode from referrals
        user.referrals.forEach((referral: any) => {
            referral.password = undefined;
            referral.apiKey = undefined;
            referral.promoCode = undefined;
            referral.referredBy = undefined;
            referral.createdAt = undefined;
            referral.updatedAt = undefined;
            referral.referrals = undefined;
        });

        /*
            registered today count,registered last week count,registered last month count,registered total count
        */
        const registeredToday = user.referrals.filter((referral: any) => {
            return referral.createdAt >= Date.now() - 24 * 60 * 60 * 1000;
        });
        // const registeredLastWeek = user.referrals.filter((referral: any) => {
        //     return referral.createdAt >= Date.now() - 7 * 24 * 60 * 60 * 1000;
        // });
        // const registeredLastMonth = user.referrals.filter((referral: any) => {
        //     return referral.createdAt >= Date.now() - 30 * 24 * 60 * 60 * 1000;
        // });
        const earnings = await EarnedFromReferrals.find({ earnedBy: userId });


        res.status(200).json({
            message: "success",
            registeredTodayCount: registeredToday.length,
            total: user.referrals.length,
            referrals: user.referrals,
            totalEarnings: earnings.map((earning: any) => earning.amount).reduce((a: any, b: any) => a + b, 0)
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}


export const getEarningsFromReferrals = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(403).json({ message: "Anauthorized!" });
        const { id } = verifyToken(token);
        if (!id) return res.status(403).json({ message: "Anauthorized!" });
        const user = await User.findById(id);
        if (!user) return res.status(403).json({ message: "Anauthorized!" });

        const earnings = await EarnedFromReferrals.find({ earnedBy: id });
        /*
            group by last day, last week, last month, and total
        */
        const lastDayEarnings = earnings.filter((earning: any) => {
            return earning.createdAt >= Date.now() - 24 * 60 * 60 * 1000;
        });
        const lastWeekEarnings = earnings.filter((earning: any) => {
            return earning.createdAt >= Date.now() - 7 * 24 * 60 * 60 * 1000;
        }
        );
        const lastMonthEarnings = earnings.filter((earning: any) => {
            return earning.createdAt >= Date.now() - 30 * 24 * 60 * 60 * 1000;
        }
        );
        const totalEarnings = earnings;
        res.status(200).json({
            message: "success",
            earnings: {
                lastDay: lastDayEarnings.map((earning: any) => earning.amount).reduce((a: any, b: any) => a + b, 0),
                lastWeek: lastWeekEarnings.map((earning: any) => earning.amount).reduce((a: any, b: any) => a + b, 0),
                lastMonth: lastMonthEarnings.map((earning: any) => earning.amount).reduce((a: any, b: any) => a + b, 0),
                total: totalEarnings.map((earning: any) => earning.amount).reduce((a: any, b: any) => a + b, 0)
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}