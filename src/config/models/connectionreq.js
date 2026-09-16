const mongoose=require("mongoose");
const connectionreqschema= mongoose.Schema({
fromuserid:{
    ref:"User",//refrence to the user that is present in the user schema this is usedd when user get all connection pending connection req with user info

type:mongoose.Schema.Types.ObjectId,
required:true

},
touserid:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
},

status:{

    type:"String",
    required:true,
    enum :{
      values:  ["accepted","rejected","interested","ignored"],
      message:'{values} is incorrect status type'
    }
}





},
{
    timestamps:true,
}
);
connectionreqschema.index({fromuserid:1,touserid:1});

connectionreqschema.pre("save", function () {

    if (this.fromuserid.equals(this.touserid)) {
        throw new Error("Cannot send request to yourself");
    }

});
const Connectionreqmodel = mongoose.model(
    "Connectionreqmodel",
    connectionreqschema
);

module.exports = Connectionreqmodel;