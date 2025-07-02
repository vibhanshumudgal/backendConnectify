
const express = require("express");
require("dotenv").config();
const DbConnectFunction = require("./config/dbConnectFun");
const cookie_parcer = require("cookie-parser");
const validator = require("validator");
const app = express();
const { authenticateUser } = require("./helper/Validation");
const User = require("./model/User");
const AuthRouter = require("./Routers/AuthRouter");
const ProfileRouter = require("./Routers/Profile");
const requestRouter = require("./Routers/Request");
const UserReqRouter = require("./Routers/UserReq");
const ChatRouter = require("./Routers/ChatRouter");
const cors = require("cors");

const allowedOrigins = [
  "http://localhost:5173",
  "https://frontend-connectify.vercel.app",
  
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookie_parcer());

app.get("/", (req, res) => {
  res.send("Welcome to the API root.");
});

app.use("/", AuthRouter);
app.use("/", ProfileRouter);
app.use("/", requestRouter);
app.use("/", UserReqRouter);
app.use("/", ChatRouter);

DbConnectFunction();

module.exports = app;
