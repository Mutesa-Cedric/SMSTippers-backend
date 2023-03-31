import { Request, Response } from "express"

import Topup from "./topupModel";
import User from "../user/userModel";

export const createNewTopup = async (req: Request, res: Response) => {
    try {
        const { amount, userId, status, paymentMethod } = req.body;
        if (!amount || !userId || !status || !paymentMethod) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }
        const newTopup = new Topup({
            amount,
            user: userId,
            status,
            paymentMethod
        });
        await newTopup.save();
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }
        user.balance += amount;
        await user.save();

        res.status(200).json({
            message: "success",
            topup: newTopup
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

export const getTopupHistory = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({
                message: "User id is required"
            })
        }
        const topups = await Topup.find({ user: userId });
        res.status(200).json({
            message: "success",
            topups: topups
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}


export const updateTopupStatus = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const { newStatus } = req.body;
        if (!newStatus) {
            return res.status(400).json({
                message: "New status is required"
            })
        }
        const topup = await Topup.findById(id);
        if (!topup) {
            return res.status(404).json({
                message: "Topup not found"
            })
        }
        topup.status = newStatus;
        await topup.save();
        res.status(200).json({ message: "success" });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}
