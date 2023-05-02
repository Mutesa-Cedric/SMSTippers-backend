import express = require("express");
import { createRefund, checkIfRefunded } from "./refundController"
const router = express.Router();

router.post("/new", createRefund);
router.post("/check", checkIfRefunded);

export default router;