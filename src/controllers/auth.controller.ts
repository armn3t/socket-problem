
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { UserDocument } from '../models/user.model';

function getAuthData(user: UserDocument) {
  return {
    token: jwt.sign({ userId: user._id }, process.env.JWT_SECRET),
    user: {
      id: user._id,
      username: user.email,
      role: user.role,
    }
  }
}

const authController = {
  async register(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Check if the user already exists
      const user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user document
      const newUser: UserDocument = new User({
        email,
        password: hashedPassword,
      });

      // Save the new user document
      await newUser.save();

      res.status(201).json({ message: 'User registered successfully', ...getAuthData(newUser) });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Check if the user exists
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Compare the passwords
      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (!isPasswordMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      res.status(200).json({ ...getAuthData(user) });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

export default authController
