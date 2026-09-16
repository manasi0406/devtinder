const express=require("express");
const mongoose=require("mongoose");
const userrouter=express.Router();
const authUser = require("../middlewares/auth");
const Connectionreqmodel = require("../config/models/connectionreq");
const User = require("../config/models/user");

//get all  the pending connection requests
userrouter.get("/user/requests",authUser,async(req,res) =>{


try{
const loggedinuser=req.user;
const connectionreq=await Connectionreqmodel.find({
    touserid : loggedinuser._id,
    status:"interested",
}).populate("fromuserid",["firstname","lastname","photourl"]);//refers to the User mongoose.model;
const connections = connectionreq.map((connection) => {

            if (connection.fromuserid._id.equals(loggedinuser._id)) {
                return connection.touserid;
            } else {
                return connection.fromuserid;
            }

        });

res.json({data:connectionreq});
}

catch(err){
    res.status(400).send("ERROR"+err.message);
}

});
//get all connections(accepted)
userrouter.get("/user/connections",authUser,async(req,res)=>{
try{
const loggedinuser=req.user;
const connectionreq=await Connectionreqmodel.find({
    $or:[
        {touserid:loggedinuser._id,status:"accepted"},
        {fromuserid:loggedinuser._id,status:"accepted"},
    ],
}).populate("fromuserid",["firstname","lastname"])
.populate("touserid", ["firstname", "lastname"]);
res.json({data:connectionreq});
}
catch(err){
    res.status(400).send("ERROR"+err.message);
}


});

//user should see all the profiles except
//own
//already have connection wheather it is ignored ,acceoeted
//already sent the connection req
userrouter.get("/feed", authUser, async (req, res) => {
    try {

        // Pagination
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit=limit>50?50:limit;
        const skip = (page - 1) * limit;

        const loggedinuser = req.user;

        // Find all requests/connections involving logged-in user
        const connectionreq = await Connectionreqmodel.find({
            $or: [
                { fromuserid: loggedinuser._id },
                { touserid: loggedinuser._id }
            ]
        });

        // Store IDs of users who should NOT appear in feed
        const hideUsersFromFeed = new Set();

        connectionreq.forEach((request) => {
            hideUsersFromFeed.add(request.fromuserid.toString());
            hideUsersFromFeed.add(request.touserid.toString());
        });

        // Don't show logged-in user
        hideUsersFromFeed.add(loggedinuser._id.toString());

        // Get valid users + pagination
        const users = await User.find({
            _id: {
                $nin: Array.from(hideUsersFromFeed)
            }
        })
        .select("firstname lastname age gender about photoUrl")
        .skip(skip)
        .limit(limit);

        res.json({
            data: users
        });

    } catch (err) {
        res.status(400).send("ERROR " + err.message);
    }
});

module.exports=userrouter;
