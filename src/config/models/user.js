const mongoose=require("mongoose");
const jwt=require("jsonwebtoken");
const validator=require("validator");
const userschema=mongoose.Schema({
firstname:
{
    type:String,
    required:true,
    minlength :4,
    maxlength:50
},
lastname :{
    type:String
},
emailid:
{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    validate(value){
    if(!validator.isEmail(value))
        throw new Error("email is invalid");
}
},
password:{
    type:String,
    required:true,
    minlength:5,

},
age:{
    type:Number,
    min :18,
},
gender: {
    type: String,
    enum: ["male", "female", "other"]
},
about :{
    type:String,
    default:"this is default info of the user!!"
},
skills:{
    type:[String],
},
photourl:{
    type:String,
    default :"https://www.magnific.com/free-photos-vectors/dummy-person",
    validate(value){
    if(!validator.isURL(value))
        throw new Error("email is invalid");
}
},
},

{
    timestamps:true,
}


);

userschema.methods.getJWT = function () {

    const user = this;

    const token = jwt.sign(
        { _id: user._id },
        "devtinder4444"
    );

    return token;
};

const User=mongoose.model("User",userschema);
module.exports=User;

