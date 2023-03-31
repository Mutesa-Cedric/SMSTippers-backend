import express = require("express");
import {
    getCurrentUser,
    login,
    signup,
    logout,
} from "./authController";

import isAuthenticated from "../../middlewares/auth";


const router = express.Router();

router.post('/login', login);
router.post("/signup", signup);
router.get("/me", getCurrentUser);
router.get("/logout", logout);

export default router;