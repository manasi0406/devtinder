const mongoose=require("mongoose");
const connectionreqschema= mongoose.Schema({
fromuserid:{
type:mongoose.Schema.Types.ObjectId,
required:true

},
touserid:{
    type:mongoose.Schema.Types.ObjectId,
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