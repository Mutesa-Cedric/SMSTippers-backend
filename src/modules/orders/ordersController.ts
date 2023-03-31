import { findUserById } from './../user/userService';
import { Request, Response } from 'express';
import Order from './orderModel';
import { verifyToken } from '../../utils/jwt';

export const createOrder = async (req: Request, res: Response) => {
    try {
        const { order_id, user, phoneNumber, country, expires_in, service_id } = req.body;
        if (!order_id || !user || !phoneNumber || !country || !expires_in || !service_id) {
            return res.status(400).json({ message: "All fields are required!" });
        }
        const order = await Order.create({
            order_id,
            user,
            phoneNumber,
            country,
            service_id,
            expires_in
        });
        res.status(201).json({ message: "success", order: order });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const getOrders = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { id } = await verifyToken(token);
        const user = await findUserById(id);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const orders = await Order.find({
            user: id
        });
        res.status(200).json({ message: "success", orders: orders });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}
