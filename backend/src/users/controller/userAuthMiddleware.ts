import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: {
        id: string;
        username: string;
        role: string;
    };
}

const verifyUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: "Acces denied. No token provided." });
            return;
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as AuthRequest['user'];

        req.user = decoded;

        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid or expired token.' });
        return;
    }
}

export default verifyUser;