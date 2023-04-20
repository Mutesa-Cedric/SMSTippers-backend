import express = require("express");
import {
    getTickets,
    getTicket,
    createTicket,
    updateTicketStatus,
    deleteTicket
} from "./ticketsController";

const router = express.Router();

router.get("/all", getTickets);
router.get("/:id", getTicket);
router.post("/create", createTicket);
router.put("/update-status", updateTicketStatus);
router.delete("/:ticketId", deleteTicket);


export default router;