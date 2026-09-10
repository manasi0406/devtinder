const express=require("express");
const authrouter=express.Router();
const { validateSignUpData } = require("../utils/validation");
const bcrypt=require("bcrypt");
const User = require("../config/models/user");
const jwt=require("jsonwebtoken");



//adding new user to database
authrouter.use("/signup", async (req, res) => {
    const { password, firstname, lastname, emailid } = req.body;

    try {
        validateSignUpData(req);

        const passwordhash = await bcrypt.hash(password, 10);

    
        const user = new User({
            firstname,
            lastname,
            emailid,
            password: passwordhash
        });

        await user.save();

        res.send("user added successfully!!");

    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
});


// login

authrouter.post("/login",async(req,res)=>{
try{

    const { emailid,password}=req.body;
    const user=await User.findOne({emailid:emailid});
    if(!user){
        throw new Error("email id is not present in the db");
    }
    const ispassvalid=await bcrypt.compare(password,user.password)
    if(ispassvalid){
// creating jwt
const token =await user.getJWT();



// sending back jwt 

res.cookie("token",token);
        res.send("login successful !!");
    }else{
        res.send("pass is incorrect");
    }
}
catch (err) {
        res.status(400).send("ERROR : " + err.message);
}
});
module.exports=authrouter;

//logout
authrouter.post("/logout",async(req,res)=>{
res.cookie("token", null, {
    expires: new Date(Date.now())
});
res.send("logged out!");
});

