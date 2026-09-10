const express = require("express");
const reqrouter = express.Router();

const User = require("../config/models/user");
const authUser = require("../middlewares/auth");
const Connectionreqmodel = require("../config/models/connectionreq");
//ignored or interested
reqrouter.post(
    "/request/send/:status/:touserid",
    authUser,
    async (req, res) => {

        try {

            const fromuserid = req.user._id;

            const touserid = req.params.touserid;

            const status = req.params.status;
            const touser=await User.findById(touserid);
if(!touser){
    return res.status(400).json({
        message: " user not find"
    });
            
}
const allowedstatus=["ignored","interested"];
if(!allowedstatus.includes(status)){
    return res.status(400).json({
        error: "Status invalid"
    });
}

const existingRequest = await Connectionreqmodel.findOne({
    $or: [
        { fromuserid: fromuserid, touserid: touserid },
        { fromuserid: touserid, touserid:fromuserid}
    ]
});

if (existingRequest) {
    return res.status(400).json({
        message: "Connection request already exists"
    });
}
            const connectionRequest = new Connectionreqmodel({
                fromuserid,
                touserid,
                status
            });

            await connectionRequest.save();

            res.send("Connection request sent");

        } catch (err) {

            console.log(err);
            res.status(400).send("Something went wrong");
        }
    }
);
//accepted or rejected  
reqrouter.post(
    "/request/review/:status/:requestid",
    authUser,
    async (req, res) => {
        try {
            const loggedinuser = req.user;

            const { status, requestid } = req.params;

            const allowedstatus = ["accepted", "rejected"];

            // Check if status is valid
            if (!allowedstatus.includes(status)) {
                return res.status(400).json({
                    message: "Status is invalid"
                });
            }

            // Find the connection request
            const connectionreq = await Connectionreqmodel.findOne({
                _id: requestid,
                touserid: loggedinuser._id,
                status: "interested"
            });

            // If request does not exist
            if (!connectionreq) {
                return res.status(400).json({
                    message: "Connection request not found"
                });
            }

            // Update status
            connectionreq.status = status;

            // Save updated request
            const data = await connectionreq.save();

            res.json({
                message: `Connection request ${status}`,
                data: data
            });

        } catch (err) {
            console.log(err);

            res.status(400).json({
                message: "Something went wrong"
            });
        }
    }
);

module.exports = reqrouter;