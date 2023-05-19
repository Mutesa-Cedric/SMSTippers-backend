import express = require("express");
import {
    createDeposit,
    getUserDeposits,
    updateDepositStatus,
    getDepositById,
    updatePaymentUrl
} from "./depositController"
import { handleWebhook } from "./crypto-webhook-handler";
const router = express.Router();

router.post("/create", createDeposit);
router.get("/get-all", getUserDeposits);
router.put("/update/:depositId", updateDepositStatus);
router.post("/get-single", getDepositById);
router.put("/update-url", updatePaymentUrl)

// @ts-ignore
router.post("/crypto-webhook", handleWebhook);

export default router;