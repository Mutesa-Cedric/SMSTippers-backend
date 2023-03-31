import { findUserById } from './../user/userService';
import { Request, Response } from "express";
import Rental from "./rentalModel";
import { verifyToken } from "../../utils/jwt";

export const createRental = async (req: Request, res: Response) => {
    try {
        const { rental_id, user, phoneNumber, service_id, days, expiry } = req.body;

        if (!rental_id || !user || !phoneNumber || !days || !expiry) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        const rental = await Rental.create({
            rental_id,
            user,
            phoneNumber,
            service_id: service_id ? service_id : null,
            days,
            expiry
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
        });
        res.status(200).json({ message: "success", rentals: rentals });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}