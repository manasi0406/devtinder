////authUser checks who the user is.
const User = require("../config/models/user");
const jwt=require("jsonwebtoken");
const authUser = async (req, res, next) => {
    try {
        // 1. Get token from cookie
        const { token } = req.cookies;

        // 2. Verify the token
        const decodedObj = jwt.verify(
            token,
            "devtinder4444"
        );

        // 3. Get user ID from decoded token
        const { _id } = decodedObj;

        // 4. Find user in database
        const user = await User.findById(_id);

        // 5. If user doesn't exist
        if (!user) {
            throw new Error("User not found");
        }
req.user=user;
        // 6. Authentication successful
        next();

    } catch (err) {
        res.status(401).send("ERROR: " + err.message);
    }
};
module.exports=authUser;
