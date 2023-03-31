import express = require("express");
import isAuthenticated from "../../middlewares/auth";
import {
    updateApiKey,
    updatePassword,
    updateProfile,
    updatePromoCode
} from "./userController";

const router = express.Router();

router.put("/update", isAuthenticated, updateProfile);
router.put("/update-password", isAuthenticated, updatePassword);
router.get("/update-api-key", isAuthenticated, updateApiKey);
router.put("/update-promo-code", isAuthenticated, updatePromoCode);

export default router;