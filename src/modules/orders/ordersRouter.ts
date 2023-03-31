import express = require("express");
import {
    createOrder,
    getOrders,
} from "./ordersController";

const router = express.Router();

router.post("/new", createOrder);
router.get("/history", getOrders);

export default router;
