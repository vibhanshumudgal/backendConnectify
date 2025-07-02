const express = require("express");
const AuthRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../model/User");
const validator = require("validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();
AuthRouter.post("/singup", async (req, res) => {
  try {
    const { name, email, age, password, about, gender } = req.body;
  
    const existingUser = await User.findOne({ email });
  
    if (existingUser) {
      return res.status(400).json({ error: "Email Already Exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      name,
      email,
      age,
      password: hashedPassword,
      about,
      gender,
    });
    const savedUser = await newUser.save();
    const token = jwt.sign(
      { _id: savedUser._id },
      process.env.JWT_SECRET || "backendUser",
      {
        expiresIn: "8h",
      }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 8 * 60 * 60 * 1000,
    });

    res.status(201).json({ savedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

AuthRouter.post("/login", async (req, res) => {
  try {
 
    const { email, password } = req.body;

    if (!validator.isEmail(email)) {
      throw new Error("Please provide correct email");
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("the emial not present");
    }
    const password_matching = await bcrypt.compare(password, user.password);
    if (!password_matching) {
      throw new Error("Plz chech tha password");
    }
    const token = jwt.sign({ _id: user._id }, "backendUser", {
      expiresIn: "8hr",
    });
    res.cookie("token", token, {
      secure: true,
      maxAge: 36000000000,
      sameSite: "None"
    });
    res.send(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

AuthRouter.post("/logout", (req, res) => {
  try {
    res.clearCookie("token");
    res.send("Logout.....");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = AuthRouter;
