const express=require("express");
const mongoose=require("mongoose");
const userrouter=express.Router();
const authUser = require("../middlewares/auth");
const Connectionreqmodel = require("../config/models/connectionreq");

//get all  the pending connection requests
userrouter.get("/user/requests",authUser,async(req,res) =>{


try{
const loggedinuser=req.user;
const connectionreq=await Connectionreqmodel.find({
    touserid : loggedinuser._id,
    status:"interested",
}).populate("fromuserid",["firstname","lastname","photourl"]);//refers to the User mongoose.model;
res.json({data:connectionreq});
}

catch(err){
    res.status(400).send("ERROR"+err.message);
}

});

module.exports=userrouter;
