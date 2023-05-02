import { findUserById } from "../user/userService";
import OrderRefund from "./orderRefundModel";
import RentalRefund from "./rentalRefundModel";
import type { Request, Response } from "express";

export const createRefund = async (req: Request, res: Response) => {
    try {
        const { order_id, rental_id, user_id, price } = req.body;
        // console.log(req.body);
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


        if (order_id) {
            const refund = await OrderRefund.create({
                order: order_id,
                user: user_id,
                price: price
            });
            res.status(201).json({
                message: "success",
                refund: refund
            });
        } else {
            const refund = await RentalRefund.create({
                rental: rental_id,
                user: user_id,
                price: price
            });
            res.status(201).json({
                message: "success",
                refund: refund
            });
        }

        user.balance = user.balance + price;
        await user.save();

    } catch (error: any) {
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
        let refund;

        if (order_id) {
            refund = await OrderRefund.findOne({ order: order_id });
        } else {
            refund = await RentalRefund.findOne({ rental: rental_id });
        }

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