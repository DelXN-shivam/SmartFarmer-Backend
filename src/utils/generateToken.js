import jwt from "jsonwebtoken";

export const generateTokens = (userId, role) => {
    // Access Token (short-lived)
    const accessToken = jwt.sign(
        { userId, role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "20m" }
    );

    // Refresh Token (long-lived)
    const refreshToken = jwt.sign(
        { userId, role },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION }
    );

    return { accessToken, refreshToken };
};
