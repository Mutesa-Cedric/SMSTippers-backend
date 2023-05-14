import { Request, Response } from "express";
import { verifyToken } from "../../utils/jwt";
import Order from "../orders/orderModel";
import Rental from "../rentals/rentalModel";
import Deposit from "../deposit/depositModel";


export const getStats = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { id } = await verifyToken(token);

        /*
        structure : 
        ----------
        {
            totalDeposits:number,
            totalSpent:number,//orders and rentals made(their prices added together),
            totalVerifications:number,
            daily:{
                deposits:number,
                spent:number,
                verifications:number,
            },
            weekly:{
                deposits:number,
                spent:number,
                verifications:number,
            },
            monthly:{
                deposits:number,
                spent:number,
                verifications:number,
            },

            // for charts, I need to provide data for all those fields for each month for the last year.

            chartData:{
                1:{//thi is for january
                    deposits:number,
                    spent:number,
                    verifications:number,
                }
                // and so on for the rest of the months
            }
        }

        */
        const orders = await Order.find({ user: id });
        const rentals = await Rental.find({ user: id });
        const deposits = await Deposit.find({ user: id });

        const totalSpent = orders.reduce((acc, order) => acc + order.price, 0) + rentals.reduce((acc, rental) => acc + rental.price, 0);


    } catch (error) {

    }
}