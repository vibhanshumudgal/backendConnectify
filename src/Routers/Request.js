const express = require("express");
const { authenticateUser } = require("../helper/Validation");
const User = require("../model/User");
const ConnectionRequest = require("../model/connectionReq");
const validator = require("validator");
const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:UserId",authenticateUser,async (req, res) => {
    try {
      const fromUserId = req.user._id.toString();
      const toUserId = req.params.UserId;
      const status = req.params.status;
    
   

      // Validate status
      const allowedStatus = ["ignored", "intrested"];
      if (!allowedStatus.includes(status)) {
        throw new Error("Status not applicable");
      }
      if (!validator.isMongoId(toUserId)) {
        throw new Error("Enter a valid userID");
      }

      const toUserData = await User.findById(toUserId);

      if (!toUserData) {
        throw new Error("User with provided UserId does not exist");
      }
      
      const requestExist1 = await ConnectionRequest.findOne({
        fromUserId:fromUserId,
        toUserId:toUserData,
      });
      const requestExist2 = await ConnectionRequest.findOne({
        fromUserId: toUserId,
        toUserId: fromUserId,
      });
   
      const requestExist = requestExist1 || requestExist2;

      // Create and save the connection request
      
      if (requestExist) {
        throw new Error("Already exist");
      }
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      
      const savedRequest = await connectionRequest.save();
    
      // Send success response
      res.json({
        message: "Feed Handel",
        data: savedRequest,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

requestRouter.post("/request/review/:status/:UserId",authenticateUser,async (req,res)=>{
  try{
    const logedInUserData = req.user;
  const {status,UserId} = req.params;
 
  const allowedStatus = ["rejected","accepted"];
  if(!allowedStatus.includes(status)){
    throw new Error("You can only accept or rejest request only");
  }
  if(!validator.isMongoId(UserId)){
    throw new Error("Enter correct userid plz");
  }
  const pendingRequest = await ConnectionRequest.findOne({
    fromUserId : UserId,
    toUserId : logedInUserData._id.toString(),
    status : "intrested"
  });
  if(!pendingRequest){
    throw new Error("No such request present");
  }
  pendingRequest.status = status;
  const data = await pendingRequest.save();
  res.json({wholeDtat:data});
  }
  catch(error){
    res.send({Error : error.message});
  }

})
module.exports = requestRouter;
