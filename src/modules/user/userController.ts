import { Request, Response } from "express"
import { verifyToken } from "../../utils/jwt";
import { apiKeyExists, findUserById, promoCodeExists } from "./userService";
import { comparePassword } from "../../utils/bcrypt";
import { generateApiKey } from "../../utils";

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { id } = await verifyToken(token);
        const user = await findUserById(id);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (name) {
            user.name = name;
        }
        if (email) {
            user.email = email;
        }
        if (password) {
            user.password = password;
        }
        await user.save();

        res.status(200).json({ message: "success", user: user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}


export const updatePassword = async (req: Request, res: Response) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { id } = await verifyToken(token);
        const user = await findUserById(id);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const isMatch = await comparePassword(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        user.password = newPassword;
        await user.save();
        res.status(200).json({ message: "success" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const updateApiKey = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { id } = await verifyToken(token);
        const user = await findUserById(id);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        let newApiKey = generateApiKey();
        while (await apiKeyExists(newApiKey)) {
            newApiKey = generateApiKey();
        }
        user.apiKey = newApiKey;
        await user.save();
        res.status(200).json({ message: "success", apiKey: newApiKey });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const updatePromoCode = async (req: Request, res: Response) => {
    try {
        let { newPromoCode } = req.body;
        if (!newPromoCode) {
            return res.status(400).json({
                message: "New Promocode is required"
            })
        }
        if (newPromoCode.length < 4) {
            return res.status(400).json({
                message: "Promocode must be at least 4 characters long"
            })
        }
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { id } = await verifyToken(token);
        const user = await findUserById(id);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (await promoCodeExists(newPromoCode)) {
            return res.status(400).json({
                message: "Promocode already exists"
            })
        }
        user.promoCode = newPromoCode;
        await user.save();
        res.status(200).json({ message: "success", newPromoCode: newPromoCode });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}