const mongoose = require("mongoose");

const connectdb = async () => {
    await mongoose.connect(
     "mongodb+srv://manasirathi50_db_user:manasi0406@cluster0.oi2lcng.mongodb.net/devtinder"
    );
};
module.exports = connectdb;
