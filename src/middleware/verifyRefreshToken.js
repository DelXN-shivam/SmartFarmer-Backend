// middleware/verifyRefreshToken.js
import jwt from "jsonwebtoken";

export const verifyRefreshToken = (req, res, next) => {
    const refreshToken = req.cookies?.jwt;

    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token missing" });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }
        req.user = decoded; // contains { id, role }
        next();
    });
};
