import express = require("express");
import isAuthenticated from "../../middlewares/auth";
import {
    updateApiKey,
    updatePassword,
    updateProfile,
    updatePromoCode
} from "./userController";
import { getStats } from "./statsController"
import { findUserByPromoCode } from "./userService";

const router = express.Router();

router.put("/update", isAuthenticated, updateProfile);
router.put("/update-password", isAuthenticated, updatePassword);
router.get("/update-api-key", isAuthenticated, updateApiKey);
router.get("/find-by-promocode", isAuthenticated, findUserByPromoCode);
router.put("/update-promo-code", isAuthenticated, updatePromoCode);
router.get("/get-stats", getStats);

export default router;