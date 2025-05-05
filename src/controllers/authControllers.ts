import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel";

export const register = async (req: Request, res: Response): Promise<void> => {
    try{
        const {name, email, password, role} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ name, email, password: hashedPassword, role});
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error in registering:", error);
        res.status(500).json({ message: "Error registering user"});
    }
};

export const login = async (req: Request, res: Response): Promise<any> => {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ message: " User not found "});
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: "Invalid credentials "});
        const token = jwt.sign({ id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: "1d"});
        res.json({ token, user});
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Login error"});
    }
};