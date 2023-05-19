
import type { Request, Response } from "express";
import { verifyToken } from "../../utils/jwt";
import User from "../user/userModel";
import Deposit from "./depositModel";


export const createDeposit = async (req: Request, res: Response) => {
    try {
        const { amount, status, payment_method, charge_id, user_id } = req.body;
        let userId: string;

        if (user_id) {
            const user = await User.findById(user_id);
            if (!user) {
                return res.status(400).json({
                    message: "Invalid user id"
                })
            }
            userId = user_id;

        } else {
            const token = req.cookies.token;
            const { id } = await verifyToken(token);
            if (!id) {
                return res.status(403).json({
                    message: "Anauthorized"
                })
            }
            userId = id;
        }

        if (!userId || !amount || !status || !payment_method) {
            return res.status(400).json({
                message: "some  required parameters are missing",
                missing_fields: {
                    userId: user_id ? "present" : "missing",
                    amount: amount ? "present" : "missing",
                    status: status ? "present" : "missing",
                    payment_method: payment_method ? "present" : "missing",
                }
            })
        }
        const deposit = await Deposit.create({
            user: userId,
            amount,
            status,
            payment_method
        });

        res.status(201).json({
            message: "success",
            deposit: deposit
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const getUserDeposits = async (req: Request, res: Response) => {
    try {
        const { user_id } = req.query;
        if (user_id) {
            const deposits = await Deposit.find({
                user: user_id
            }).sort({ createdAt: -1 });
            return res.status(200).json({ message: "success", deposits: deposits });
        }
        const token = req.cookies.token;
        const { id } = await verifyToken(token);
        if (!id) {
            return res.status(403).json({
                message: "Anauthorized"
            })
        }
        const deposits = await Deposit.find({ user: id }).sort({ updatedAt: -1 });
        // check for deposits with status pending and have more than 6 hours and update their status to failed
        const pendingDeposits = deposits.filter(deposit => deposit.status === "pending");

        const failedDeposits = pendingDeposits.filter(deposit => {
            const depositDate = new Date(deposit.createdAt);
            const currentDate = new Date();
            const diff = currentDate.getTime() - depositDate.getTime();
            const hours = diff / (1000 * 60 * 60);
            return hours >= 6;
        });

        if (failedDeposits.length > 0) {
            failedDeposits.forEach(async deposit => {
                deposit.status = "failed";
                await deposit.save();
            })
        }

        res.status(200).json({
            message: "success",
            deposits: deposits
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export const updateDepositStatus = async (req: Request, res: Response) => {
    try {
        const { depositId } = req.params;
        const { new_status } = req.body;
        // console.log(new_status);

        if (!depositId) {
            return res.status(400).json({
                message: "no deposit specified"
            })
        }

        if (!["successful", "failed", "pending"].includes(new_status)) {
            return res.status(400).json({
                message: "invalid status"
            })
        }

        const token = req.cookies.token;
        const { id } = await verifyToken(token);
        if (!id) {
            return res.status(403).json({
                message: "Anauthorized"
            })
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({
                message: "invalid user"
            })
        }

        const deposit = await Deposit.findById(depositId);


        if (!deposit) {
            return res.status(400).json({
                message: "invalid deposit_id"
            })
        }

        if (deposit.status === "successful") {
            return res.status(400).json({
                message: "deposit already successful"
            })
        }

        if (new_status === "successful") {
            user.balance += deposit.amount;
            await user.save();
        }

        deposit.status = new_status;
        await deposit.save();

        res.status(200).json({
            message: "success",
            deposit: deposit
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export const getDepositById = async (req: Request, res: Response) => {
    try {
        const { deposit_id } = req.body;
        if (!deposit_id) {
            return res.status(400).json({
                message: "Deposit id is required"
            })
        }
        const deposit = await Deposit.findById(deposit_id);
        if (!deposit) {
            return res.status(400).json({
                message: "Invalid deposit id"
            })
        }
        res.status(200).json({
            message: "success",
            deposit: deposit
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export const updatePaymentUrl = async (req: Request, res: Response) => {
    try {
        const { deposit_id, payment_url } = req.body;
        if (!deposit_id || !payment_url) {
            return res.status(400).json({
                message: "deposit_id and payment_url are required",
                missing_fields: {
                    deposit_id: deposit_id ? "present" : "missing",
                    payment_url: payment_url ? "present" : "missing"
                }
            })
        }

        const deposit = await Deposit.findById(deposit_id);
        if (!deposit) {
            return res.status(400).json({
                message: "Invalid deposit id"
            })
        };

        deposit.payment_url = payment_url;
        await deposit.save();

        res.status(200).json({
            message: "success",
            deposit: deposit
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}