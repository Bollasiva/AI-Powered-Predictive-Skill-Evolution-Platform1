import { Request, Response } from 'express';
import User from '../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// REGISTER USER
export const register = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    try {
        // Check existing user
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Create new user
        user = new User({ name, email, password });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // JWT Payload
        const payload = { user: { id: user.id } };

        // Create token
        jwt.sign(
            payload,
            process.env.JWT_SECRET as string,
            { expiresIn: '5d' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );

    } catch (err: any) {
        console.error('Register Error:', err.message);
        res.status(500).send('Server error');
    }
};


// LOGIN USER
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        // Check user
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // JWT Payload
        const payload = { user: { id: user.id } };

        // Create token
        jwt.sign(
            payload,
            process.env.JWT_SECRET as string,
            { expiresIn: '5d' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );

    } catch (err: any) {
        console.error('Login Error:', err.message);
        res.status(500).send('Server error');
    }
};


// GET LOGGED-IN USER
export const getUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err: any) {
        console.error('GetUser Error:', err.message);
        res.status(500).send('Server Error');
    }
};
