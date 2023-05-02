import { findUserById } from "../user/userService";
import Refund from "./refundModel";
import type { Request, Response } from "express";

export const createRefund = async (req: Request, res: Response) => {
    try {
        const { order_id, rental_id, user_id, price } = req.body;
        if (!order_id && !rental_id) {
            return res.status(400).json({
                message: "Either order_id or rental_id is required"
            })
        }
        if (!user_id) {
            return res.status(400).json({
                message: "user_id is required"
            })
        }
        if (!price) {
            return res.status(400).json({
                message: "price to be refunded is required"
            })
        }

        // add price to user's balance
        const user = await findUserById(user_id);
        if (!user) {
            return res.status(400).json({
                message: "Invalid user_id"
            })
        }


        const refund = await Refund.create({
            order: order_id,
            rental: rental_id,
            user: user_id
        });
        res.status(201).json({
            message: "success",
            refund: refund
        });

        user.balance = user.balance + price;
        await user.save();

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const checkIfRefunded = async (req: Request, res: Response) => {
    try {
        const { order_id, rental_id } = req.body;
        if (!order_id && !rental_id) {
            return res.status(400).json({
                message: "Either order_id or rental_id is required"
            })
        }
        const refund = await Refund.findOne({
            order: order_id,
            rental: rental_id
        });

        if (!refund) {
            res.status(200).json({
                refunded: false
            })
        } else {
            res.status(200).json({
                refunded: true
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        })
    }

}