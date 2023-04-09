import { Request, Response } from "express";
import Ticket from "./ticketModel";
import { generateTicketId } from "../../utils";

export const getTickets = async (req: Request, res: Response) => {
    try {
        const tickets = await Ticket.find();
        res.status(200).json({
            message: "success",
            tickets: tickets
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getTicket = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const ticket = await Ticket.findById(id);
        ticket ?
            res.status(200).json({
                message: "success",
                ticket: ticket
            })
            :
            res.status(404).json({ message: "Ticket not found" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const createTicket = async (req: Request, res: Response) => {
    try {
        const { title, description, status, userId } = req.body;
        if (!title || !description || !status || !userId) {
            return res.status(400).json({ message: "missing required fields." });
        }

        let ticketId = generateTicketId();

        // check if ticketId already exists

        const existingTicket = await Ticket.find({ ticket_id: ticketId });
        while (existingTicket.length > 0) {
            ticketId = generateTicketId();
        }

        const ticket = await Ticket.create({
            title,
            description,
            status,
            ticket_id: ticketId,
            createdBy: userId
        });
        res.status(201).json({
            message: "success",
            ticket: ticket
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateTicketStatus = async (req: Request, res: Response) => {
    try {
        const { ticketId, newStatus } = req.body;
        if (!ticketId || !newStatus) {
            return res.status(400).json({ message: "missing required fields." });
        }
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }
        ticket.status = newStatus;
        await ticket.save();
        res.status(200).json({
            message: "success",
            ticket: ticket
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" });
    }
}


export const deleteTicket = async (req: Request, res: Response) => {
    try {
        const { ticketId } = req.body;
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }
        await ticket.deleteOne();
        res.status(200).json({ message: "success" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}