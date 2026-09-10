const express = require("express");
const app = express();
const cookieparser=require("cookie-parser");
app.use(cookieparser());
const { validateEditProfileData } = require("./utils/validation");
const jwt=require("jsonwebtoken");
const authUser = require("./middlewares/auth");
const { validateSignUpData } = require("./utils/validation");
const User = require("./config/models/user");
const bcrypt=require("bcrypt");
const connectdb = require("./config/database");
app.use(express.json());


const authrouter=require("./routes/auth.js");
const profilerouter=require("./routes/profile.js");
const reqrouter=require("./routes/request.js");
app.use("/",authrouter);

app.use("/",profilerouter);
app.use("/",reqrouter);


//
app.get("/feed",async(req,res)=>{
try{

    const users= await User.find({});
    res.send(users);
}catch{
    res.status(400).send("something went wrong");
    
}

});


//login 


app.post("/login",async(req,res)=>{
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





//delelet user from the database
app.delete("/user", async (req, res) => {
    const userid= req.body.userid;
    try {
        
       const user= User.findByIdAndDelete(userid);

        res.send("User deleted");
    } catch (err) {
        res.status(400).send(err);
    }
});

app.patch("/user", async (req, res) => {

    const userId = req.body.userId;

    const user = await User.findByIdAndUpdate(
        userId,
        req.body
    );
    const ALLOWED_UPDATES = ["userId","firstName", "lastName", "age", "about","password","gender"];

const updates = Object.keys(req.body);

const isUpdateAllowed = updates.every((key) =>
    ALLOWED_UPDATES.includes(key)
);

if (!isUpdateAllowed) {
    throw new Error("Update not allowed");
}
console.log(" updated !!");

    res.send(user);
});
//send connection req


connectdb()
    .then(() => {
        console.log("database is connected");

        app.listen(3000, () => {
            console.log("listening to server ....");
        });
    })
    .catch((err) => {
        console.log(err);
    });