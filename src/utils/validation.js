//validation.js checks what the user is trying to edit
const validator = require("validator");

const validateSignUpData = (req) => {
    const { firstname, lastname, emailid, password } = req.body;

    if (!firstname) {
        throw new Error("Name is required");
    }

    if (!validator.isEmail(emailid)) {
        throw new Error("Invalid Email");
    }

    if (!validator.isStrongPassword(password)) {
        throw new Error("Please enter a strong password");
    }
};
//edit profile
const validateEditProfileData = (req) => {

    const allowedEditFields = [
        "firstname",
        "lastname",
        "age",
        "gender",
        "about",
        "photoUrl"
    ];

    const isEditAllowed = Object.keys(req.body).every((field) =>
        allowedEditFields.includes(field)
    );

    if (!isEditAllowed) {
        throw new Error("Edit not allowed");
    }
};


module.exports = {
    validateSignUpData,
    validateEditProfileData

};
