const express = require("express");
const { authenticateUser } = require("../helper/Validation");
const connectionReq = require("../model/connectionReq");
const User = require("../model/User");
const UserReqRouter = express.Router();
const User_safe_data = "name email age about gender";
// Example route for getting user information
UserReqRouter.get(
  "/user/Connection/request",
  authenticateUser,
  async (req, res) => {
   
    try {
      const userid = req.user._id;
      const Wholedata = await connectionReq
        .find({
          toUserId: userid,
          status: "intrested",
        })
        .populate("fromUserId", ["name", "email", "age", "about", "gender"]);
      const senderData = Wholedata.map((field) => {
        return field.fromUserId;
      });
      res.send(senderData);
    } catch (error) {
      res.sendStatus(400);
    }
  }
);

UserReqRouter.get("/user/connections", authenticateUser, async (req, res) => {
  try {
    const userid = req.user._id;

    const connectionrequests = await connectionReq
      .find({
        $or: [
          { fromUserId: userid, status: "accepted" },
          { toUserId: userid, status: "accepted" },
        ],
      })
      .populate("fromUserId", User_safe_data)
      .populate("toUserId", User_safe_data);

    const data = connectionrequests.map((field) => {
      if (field.fromUserId._id.toString() === userid.toString())
        return field.toUserId;
      return field.fromUserId;
    });
    res.send(data);
    
  } catch (error) {
    res.sendStatus(402);
  }
});

UserReqRouter.get("/user/feed", authenticateUser, async (req, res) => {
  try {
    const userId = req.user._id;
    const connections = await connectionReq.find({
      $or: [{ toUserId: userId }, { fromUserId: userId }],
    });
    const unique_id = new Set();
    connections.forEach((ids) => {
      unique_id.add(ids.toUserId.toString());
      unique_id.add(ids.fromUserId.toString());
    });
    const feed_data = await User.find({
      $and: [
        { _id: { $nin: Array.from(unique_id) } },
        { _id: { $ne: userId } },
      ],
    }).select();
    res.send(feed_data);
  } catch (error) {
    res.send(error);
  }
});
module.exports = UserReqRouter;
