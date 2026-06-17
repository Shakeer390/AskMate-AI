import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    console.log("AUTH HEADER:", req.headers.authorization);
    let token = req.headers.authorization?.split(" ")[1];;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.json({
        success: false,
        message: "Not authorised or User not found",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorised , Token failed" });
  }
};