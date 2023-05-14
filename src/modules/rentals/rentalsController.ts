import { findUserById } from './../user/userService';
import { Request, Response } from "express";
import Rental from "./rentalModel";
import { verifyToken } from "../../utils/jwt";
import User from '../user/userModel';

export const createRental = async (req: Request, res: Response) => {
    try {
        const { rental_id, phoneNumber, service_id, days, expiry, price, country, user_id } = req.body;

        const token = req.cookies.token;

        if (!rental_id || !phoneNumber || !days || !expiry || !price || !country) {
            return res.status(400).json({
                message: "All fields are required!",
                missing_fields: {
                    user_id: !user_id && !token ? "missing" : "not missing",
                    rental_id: !rental_id ? "missing" : "not missing",
                    phoneNumber: !phoneNumber ? "Missing" : "not missing",
                    days: !days ? "missing" : "not missing",
                    expiry: !expiry ? "missing" : "not missing",
                    price: !price ? "missing" : "not missing",
                    country: !country ? "missing" : "not missing"
                }
            });
        }


        if (!token && !user_id) {
            return res.status(403).json({
                message: "Anauthorized"
            })
        }

        let user: any;

        if (user_id) {
            user = await User.findById(user_id);
        } else {
            const { id } = await verifyToken(token);
            user = await findUserById(id);
        }

        if (!user) {
            return res.status(403).json({
                message: "Anauthorized"
            })
        }

        user.balance -= price;
        await user.save();


        const rental = await Rental.create({
            rental_id,
            user: user._id,
            phoneNumber,
            service_id: service_id ? service_id : null,
            days,
            expiry,
            price,
            country
        });

        res.status(201).json({ message: "success", rental: rental });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}
export const getRentals = async (req: Request, res: Response) => {
    try {
        const { user_id } = req.query;
        if (user_id) {
            const rentals = await Rental.find({
                user: user_id
            }).sort({ createdAt: -1 });
            return res.status(200).json({ message: "success", rentals: rentals });
        }
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { id } = await verifyToken(token);
        const user = await findUserById(id);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const rentals = await Rental.find({
            user: id
        }).sort({ createdAt: -1 });
        res.status(200).json({ message: "success", rentals: rentals });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const getSingleRental = async (req: Request, res: Response) => {
    try {
        const { rental_id } = req.params;
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { id } = await verifyToken(token);
        const user = await findUserById(id);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const rental = await Rental.findOne({
            rental_id: rental_id,
            user: id
        });
        if (!rental) {
            return res.status(404).json({ message: "Rental not found" });
        }
        res.status(200).json({ message: "success", rental: rental });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}