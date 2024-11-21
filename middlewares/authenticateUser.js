import jwt from "jsonwebtoken";
import UserModel from "../models/User.js";

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.cookies?.authToken;
    if (!token) {
      return res.status(401).send("Unauthorized: Token not found. Please login.");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await UserModel.findById(decoded.userID);

    if (!user) {
      return res.status(401).send("Unauthorized: Invalid token.");
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).send("Unauthorized: Token verification failed.");
  }
};

export default authenticateUser;