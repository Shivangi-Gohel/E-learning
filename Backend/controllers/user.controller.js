import bcrypt from "bcryptjs";
import {generateToken} from "../utils/generateToken.js";
import {User} from "../models/user.model.js";

const register = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        if (!name || !email || !password) {
            return res.status(400)
            .json({
                success: false,
                message: "Please fill all the fields"
            });
        }
        const user = await User.findOne({email});
        if (user) {
            return res.status(400)
            .json({
                success: false,
                message: "User already exists"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            name,
            email,
            password: hashedPassword,
        });
        return res.status(201)
        .json({
            success: true,
            message: "User registered successfully"
        });
    } catch (error) {
        console.log(error);
        return res.status(500)
        .json({
            success: false,
            message: "Internal server error"
        });
    }
};

const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(400)
            .json({
                success: false,
                message: "Please fill all the fields"
            });
        }
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400)
            .json({
                success: false,
                message: "Invalid credentials"
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400)
            .json({
                success: false,
                message: "Password is incorrect"
            });
        }
        generateToken(res, user, `Welcome back ${user.name}`);
    } catch (error) {
        console.log(error);
        return res.status(500)
        .json({
            success: false,
            message: "Internal server error"
        });
    }
}

export {register, login};