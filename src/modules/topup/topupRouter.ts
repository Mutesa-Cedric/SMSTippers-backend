import express = require("express");
import {
    createNewTopup,
    getTopupHistory,
    updateTopupStatus,
} from "./topupController";

const router = express.Router();

router.get("/history", getTopupHistory);
router.post("/new", createNewTopup);
router.put("/update-status/:id", updateTopupStatus);

export default router;