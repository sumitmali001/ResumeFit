import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "resumefit_jwt_secret_key_2026");

      req.user = await User.findById(decoded.id).select("-password");
      return next();
    } catch (error) {
      console.error("[Auth Middleware Error]:", error.message);
      return res.status(401).json({ error: "Not authorized, invalid token" });
    }
  }

  // Optional authentication - if no token, allow request to proceed as guest
  req.user = null;
  next();
};
