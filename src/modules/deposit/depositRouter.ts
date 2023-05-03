import express = require("express");
import {
    createDeposit,
    getUserDeposits,
    updateDepositStatus,
    getDepositById
} from "./depositController"
const router = express.Router();

router.post("/create", createDeposit);
router.post("/get-all", getUserDeposits);
router.post("/update-status", updateDepositStatus);
router.post("/get-single", getDepositById);

export default router;