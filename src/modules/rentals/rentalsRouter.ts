import express = require("express");
import {
    createRental,
    getRentals,
    getSingleRental
} from "./rentalsController";

const router = express.Router();

router.get("/history", getRentals);
router.get("/history/:id", getSingleRental);
router.post("/create", createRental);

export default router;