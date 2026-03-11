import { prisma } from "../../lib/prisma.js";
import { Request, Response } from "express";
import { hashPassword, verifyPassword } from "../../utils/hash.js";
import jwt from "jsonwebtoken";
import { AuthRequest } from "./userAuthMiddleware.js";

const handleCreateUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username or password is missing" });
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        username,
        passwordHash: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
      },
    });

    return res.status(201).json({ message: "Successfully created user", user });
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Username is already taken" });
    }

    console.error("Error while creating user: " + error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const handleUserLogin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and passwrod are required." });
    }

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await verifyPassword(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "24h",
      },
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error during login: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const handleGetUser = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const userInfo = prisma.user.findUnique({
            where: {
                id: req.user.id
            }
        });

        res.status(201).json({ message: "Successfully fetched user information.", data: userInfo });
    } catch (error) {
        console.error("Error getting user info: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


export {
    handleCreateUser,
    handleUserLogin,
    handleGetUser
}