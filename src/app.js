const express = require("express");
require("dotenv").config();
const DbConnectFunction = require("./config/dbConnectFun");
const cookie_parcer = require("cookie-parser");
const validator = require("validator");
const app = express();
const port = process.env.PORT || 3000;
const { authenticateUser } = require("./helper/Validation");
const User = require("./model/User");
const AuthRouter = require("./Routers/AuthRouter");
const ProfileRouter = require("./Routers/Profile");
const requestRouter = require("./Routers/Request");
const UserReqRouter = require("./Routers/UserReq");
const cors = require("cors");
const http = require("http");
const initializesocket = require("./helper/socket");
const ChatRouter = require("./Routers/ChatRouter");
const server = http.createServer(app);

initializesocket(server);

app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, origin || "*");
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



DbConnectFunction()
  .then(() => {
    server.listen(port, () => {
      console.log(`Server is runniuuung on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log("Error connecting to the database:", error);
  });
