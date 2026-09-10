const express=require("express");
const profilerouter=express.Router();
const bcrypt = require("bcrypt");

const User = require("../config/models/user");
const authUser = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
//view profile
profilerouter.get("/profile/view",authUser,async(req,res)=>{
try{
    const user=req.user;
    
    res.send(user);
}
catch (err) {
        res.status(400).send("ERROR : " + err.message);
}
});

//edit profile





profilerouter.patch("/profile/edit", authUser, async (req, res) => {

    try {

        validateEditProfileData(req);

        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key) => {
            loggedInUser[key] = req.body[key];
        });

        await loggedInUser.save();

        res.send("Profile updated successfully");

    } catch (err) {

        res.status(400).send(err.message);

    }

});

// reset passs
profilerouter.patch("/profile/reset-password", authUser, async (req, res) => {

    try {

        // 1. Get logged-in user's ID from JWT
        const userId = req.user._id;

        // 2. Get new password from request
        const { newPassword } = req.body;

        // 3. Find user in database
        const user = await User.findById(userId);

        // 4. Hash new password
        user.password = await bcrypt.hash(newPassword, 10);

        // 5. Save updated user
        await user.save();

        // 6. Send response
        res.send("Password reset successfully");

    } catch (err) {

        res.status(400).send("Something went wrong");

    }

});
module.exports=profilerouter;
