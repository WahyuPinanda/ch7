import express from "express";
import UserController from "../controllers/userController.js";
import authenticateUser from "../middlewares/authenticateUser.js";
const router = express.Router();

router.get("/", (req, res) => res.render("index"));

// Halaman Login
router.get("/login", (req, res) => res.render("login", { message: null }));
router.post("/login", UserController.userLogin);

// Halaman Register
router.get("/register", (req, res) => res.render("register", { message: null }));
router.post("/register", UserController.userRegistration);

// Halaman Ganti Password
router.get("/changepassword", (req, res) => res.render("changepassword", { message: null }));
router.post("/change-password", authenticateUser, UserController.changeUserPassword);

export default router;