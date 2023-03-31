import express = require("express");
import {
    createRental,
    getRentals,
} from "./rentalsController";

const router = express.Router();

router.get("/history", getRentals);
router.post("/new", createRental);

export default router;