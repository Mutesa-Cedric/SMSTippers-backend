
import type { Request, Response } from "express"
import Deposit from "./depositModel";
import { verifyToken } from "../../utils/jwt";

export const createDeposit = async (req: Request, res: Response) => {
    try {
        const { amount, status, payment_method } = req.body;

        const token = req.cookies.token;
        const { id } = await verifyToken(token);
        if (!id) {
            return res.status(403).json({
                message: "Anauthorized"
            })
        }
        const user_id = id;
        if (!user_id || !amount || !status || !payment_method) {
            return res.status(400).json({
                message: "some  required parameters are missing",
                missing_fields: {
                    user_id: user_id ? "present" : "missing",
                    amount: amount ? "present" : "missing",
                    status: status ? "present" : "missing",
                    payment_method: payment_method ? "present" : "missing",
                }
            })
        }
        const deposit = await Deposit.create({
            user: user_id,
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
        const token = req.cookies.token;
        const { id } = await verifyToken(token);
        if (!id) {
            return res.status(403).json({
                message: "Anauthorized"
            })
        }
        const deposits = await Deposit.find({ user: id }).sort({ updatedAt: -1 });
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
        const { deposit_id, new_status } = req.body;
        if (!deposit_id) {
            return res.status(400).json({
                message: "no deposit specified"
            })
        }
        if (new_status !== "successful" || new_status !== "failed" || new_status !== "pending") {
            return res.status(400).json({
                message: "invalid status"
            })
        }

        const deposit = await Deposit.findById(deposit_id);
        if (!deposit) {
            return res.status(400).json({
                message: "invalid deposit_id"
            })
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