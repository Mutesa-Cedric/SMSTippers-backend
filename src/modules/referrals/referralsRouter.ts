import express = require("express");
import { createReferral, getEarningsFromReferrals, getReferrals } from "./referralsController";

const router = express.Router();

router.post("/create", createReferral);
router.get("/get", getReferrals);
router.get("/get-earnings", getEarningsFromReferrals);


export default router;