import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import transporter from "../config/emailConfig.js";

class UserController {
  // Registrasi User
  static userRegistration = async (req, res) => {
    const { name, email, password, password_confirmation } = req.body;
    const user = await UserModel.findOne({ email: email });

    if (user) {
      res.render("register", { message: "Email already exists" });
    } else {
      if (name && email && password && password_confirmation) {
        if (password === password_confirmation) {
          try {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);

            const newUser = new UserModel({ name, email, password: hashPassword });
            await newUser.save();

            // Kirim email selamat datang
            await transporter.sendMail({
              from: process.env.EMAIL_FROM,
              to: email,
              subject: "Welcome to Our App dude",
              html: `<h1>Welcome, ${name}!</h1><p>Thank you for registering on our platform.</p>`,
            });

            res.redirect("/login");
          } catch (error) {
            console.error(error);
            res.render("register", { message: "Unable to Register" });
          }
        } else {
          res.render("register", { message: "Password and Confirm Password don't match" });
        }
      } else {
        res.render("register", { message: "All fields are required" });
      }
    }
  };

  // Login User
  static userLogin = async (req, res) => {
    const { email, password } = req.body;

    if (email && password) {
      try {
        const user = await UserModel.findOne({ email });

        if (user) {
          const isMatch = await bcrypt.compare(password, user.password);

          if (isMatch) {
            const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
            res.cookie("authToken", token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production", // Aktifkan secure untuk HTTPS
              maxAge: 24 * 60 * 60 * 1000, // 1 hari
            }); // Simpan token di cookie
            res.redirect("/changepassword");
          } else {
            res.render("login", { message: "Invalid email or password" });
          }
        } else {
          res.render("login", { message: "User not found" });
        }
      } catch (error) {
        console.error(error);
        res.render("login", { message: "Unable to Login" });
      }
    } else {
      res.render("login", { message: "All fields are required" });
    }
  };

  // Ganti Password
  static changeUserPassword = async (req, res) => {
    const { password, password_confirmation } = req.body;
    if (password && password_confirmation) {
      if (password !== password_confirmation) {
        return res.render("login", { message: "Password and confirmation don't match" });
      }
      try {
        // Hash password baru
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const user = await UserModel.findByIdAndUpdate(req.user._id, { $set: { password: hashPassword } });
  
        if (!user) {
          return res.render("login", { message: "User not found. Unable to change password." });
        }
  
        // Kirim email notifikasi
        await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: user.email,
          subject: "Password Changed Notification",
          html: `
            <h1>Password Changed Successfully</h1>
            <p>Hi ${user.name},</p>
            <p>Your password has been changed successfully. If you did not request this change, please contact 911.</p>
          `,
        });
        res.render("login", { message: "Password changed successfully and notification sent." });
      } catch (error) {
        console.error("Error changing password:", error);
        res.render("login", { message: "Unable to change password." });
      }
    } else {
      res.render("login", { message: "All fields are required." });
    }
  };
  // Mendapatkan Detail User
  static getUserDetail = async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "User ID is required in URL parameter",
        });
      }

      const userDetail = await UserModel.findById(id);

      if (!userDetail) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.status(200).json({
        success: true,
        data: userDetail,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching user details",
      });
    }
  };
}

export default UserController;