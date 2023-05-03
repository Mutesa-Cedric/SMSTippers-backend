import express = require("express");
import {
    createDeposit,
    getUserDeposits,
    updateDepositStatus,
    getDepositById
} from "./depositController"
import { handleWebhook } from "./crypto-webhook-handler";
const router = express.Router();

router.post("/create", createDeposit);
router.get("/get-all", getUserDeposits);
router.post("/update-status", updateDepositStatus);
router.post("/get-single", getDepositById);

// @ts-ignore
router.post("/crypto-webhook", handleWebhook);

export default router;