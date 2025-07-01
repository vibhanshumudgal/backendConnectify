const jwt = require("jsonwebtoken");
const User = require("../model/User"); // Corrected import
require("dotenv").config();
const authenticateUser = async (req, res, next) => {
  try {
    // Ensure cookies are parsed (using middleware like cookie-parser)
   
    const { token } = req.cookies;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Invalid request. Token missing." });
    }
   
    // Verify token
    const cookie_data = jwt.verify(
      token,
      process.env.JWT_SECRET || "backendUser"
    ); 
    const { _id } = cookie_data;

    // Fetch user data
    const User_data = await User.findOne({ _id: _id });
    if (!User_data) {
      return res
        .status(401)
        .json({ message: "Session expired. Please re-login." });
    }

    // Attach user data to request
    req.user = User_data;

    // Proceed to the next middleware
    // console.log("ki");
    next();
  } catch (err) {
    console.error("Authentication Error:", err.message);
    res.status(401).json({
      message: "Authentication failed. Please re-login.",
      error: err.message,
    });
  }
};

const vEditData = (req) => {
  const allowedEditFields = ["name", "gender", "age", "about"];
 
  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  return isEditAllowed;
};

module.exports = {
  authenticateUser,
  vEditData,
};
