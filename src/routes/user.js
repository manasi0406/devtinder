const express = require("express");
const mongoose = require("mongoose");

const userrouter = express.Router();

const authUser = require("../middlewares/auth");
const Connectionreqmodel = require("../config/models/connectionreq");
const User = require("../config/models/user");


// GET ALL THE PENDING CONNECTION REQUESTS
userrouter.get("/user/requests", authUser, async (req, res) => {

    try {

        const loggedinuser = req.user;

        const connectionreq = await Connectionreqmodel.find({
            touserid: loggedinuser._id,
            status: "interested",
        })
        .populate(
            "fromuserid",
            ["firstname", "lastname", "photourl"]
        );

        const connections = connectionreq.map((connection) => {

            if (connection.fromuserid._id.equals(loggedinuser._id)) {
                return connection.touserid;
            } else {
                return connection.fromuserid;
            }

        });

        res.json({
            data: connectionreq
        });

    } catch (err) {

        res.status(400).send("ERROR" + err.message);

    }

});


// GET ALL CONNECTIONS (ACCEPTED)
userrouter.get("/user/connections", authUser, async (req, res) => {

    try {

        const loggedinuser = req.user;

        const connectionreq = await Connectionreqmodel.find({

            $or: [
                {
                    touserid: loggedinuser._id,
                    status: "accepted"
                },
                {
                    fromuserid: loggedinuser._id,
                    status: "accepted"
                }
            ]

        })
        .populate(
            "fromuserid",
            ["firstname", "lastname", "age", "gender", "about", "photourl"]
        )
        .populate(
            "touserid",
            ["firstname", "lastname", "age", "gender", "about", "photourl"]
        );


        const connections = connectionreq.map((connection) => {

            if (connection.fromuserid._id.equals(loggedinuser._id)) {

                return connection.touserid;

            } else {

                return connection.fromuserid;

            }

        });


        console.log("FINAL CONNECTIONS:", connections);


        res.json({
            data: connections
        });

    } catch (err) {

        res.status(400).send("ERROR: " + err.message);
    }

});
// FEED
userrouter.get("/feed", authUser, async (req, res) => {

    try {

        // Pagination
        const page = parseInt(req.query.page) || 1;

        let limit = parseInt(req.query.limit) || 10;

        limit = limit > 50 ? 50 : limit;

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

            hideUsersFromFeed.add(
                request.fromuserid.toString()
            );

            hideUsersFromFeed.add(
                request.touserid.toString()
            );

        });


        // Don't show logged-in user
        hideUsersFromFeed.add(
            loggedinuser._id.toString()
        );


        // Get valid users + pagination
        const users = await User.find({

            _id: {
                $nin: Array.from(hideUsersFromFeed)
            }

        })
        .select(
            "firstname lastname age gender about photourl"
        )
        .skip(skip)
        .limit(limit);


        res.json({
            data: users
        });


    } catch (err) {

        res.status(400).send(
            "ERROR " + err.message
        );

    }

});


module.exports = userrouter;