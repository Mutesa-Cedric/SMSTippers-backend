import express = require("express");
import { createReferral, getReferrals } from "./referralsController";

const router = express.Router();

router.post("/create", createReferral);
router.get("/get", getReferrals);


export default router;