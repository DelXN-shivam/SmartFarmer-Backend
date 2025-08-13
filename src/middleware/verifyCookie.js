import jwt from 'jsonwebtoken'

export const verifyCookieToken = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(401).json({ message: "Invalid token" });
    req.user = user; // contains id and role
    next();
  });
};
