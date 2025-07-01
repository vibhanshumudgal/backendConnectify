const express = require("express");
const ProfileRouter = express.Router();
const { authenticateUser, vEditData } = require("../helper/Validation");
const User = require("../model/User");

ProfileRouter.get("/profile/view", authenticateUser, async (req, res) => {
  const { name, _id, about, age, email, gender } = req.user;
  res.status(200).json({ name, _id, about, age, email, gender });
});

ProfileRouter.get("/profile/:targetId", authenticateUser, async (req, res) => {
  try {
    const { targetId } = req.params;
   
    const user = await User.findById(targetId).select("name age about gender email");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server Fuk gya" });
  }
});

ProfileRouter.patch("/profile/edit", authenticateUser, async (req, res) => {
  try {
    if (!vEditData(req)) {
      throw new Error("Enter data contains such that that cant be change");
    }

    const newData = req.body;
    const databaseData = req.user;

    for (const key in newData) {
      databaseData[key] = newData[key];
    }
    const updated_data = await databaseData.save();

    res.status(200).json(updated_data);
  } catch (error) {
    res.json({ error: error.message });
  }
});
module.exports = ProfileRouter;
