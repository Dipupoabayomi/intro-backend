const User = require('../models/user');
const sendTokenResponse = require('../utils/sendToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

const register = async (req, res) =>{
    const { firstname, lastname, email, password } = req.body;

    try{
        if(!email || !password || !firstname || !lastname){
            return res
            .status(404)
            .json({ success: false, message: "please input all fields"})
        }
        // check for user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res
            .status(409)
            .json({ success: false, message: "User already exists"})
        }

        // create User
        const user = await User.create({
            email,
            firstname,
            password,
            lastname,
        });

        const options ={
            email: email,
            subject: "welcome to Backend",
            emailBody:`welcome to ${process.env.NAME}`
        }

        await sendEmail(options);

        // res.status(201)
        // .json({success: true, message: "user create successfully"});

        // sendTokenResponse
        sendTokenResponse(user, 201, res, 'user created successfully')


    } catch (err) {
        console.error("something went wrong:", err);
        res.status(500).json({error: "Something went wrong"});
    }

};


const login = async (req, res) =>{

    const {email, password} = req.body;

    // validate email and password
    if(!email) {
        return res 
        .status(400)
        .json({success: "false", message: "please input your email"})
    }
    if(!email) {
        return res 
        .status(400)
        .json({success: "false", message: "please input your email"})
    }

    // check for user
const user = await User.findOne({email}). select("+password")
if (!user) {
    return res
    .status(401)
    .json({success: false, message: "User does not exist"})
}

// check if password matches
const isMatch = await user.matchPassword(password)

if(!isMatch){
    return res.status(422)
    .json({success: "false", message: "Invalid Password"});
}

// send token
sendTokenResponse(user, 200, res, "Login successful")

};

const updateDetails = async(req, res) => {
    const fieldsToUpdate = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
    };

    const user = await User.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
        new:true,
        runValidators: true,
    });

    sendTokenResponse(user, 200, res, "User Details updated successfully");
}

const updatePassword = async(req, res) => {
    const user = await User.findById(req.params.id).select("+password");

    // check current password
    if (!(await user.matchPassword(req.body.currentPassword))){
        return res.status(401)
             .status(401)
             .json({success: false, message: "Password is incorrect"});
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res, "Password changed Successfully");
}

const forgotPassword = async (req, res) => {
    
        const user = await User.findOne({email: req.body.email});
        if(!user){
            return res.status(404)
                  .json({success:false, message: "There is no user with this email"})
        }
    const resetToken = user.getResetPasswordToken();

    await user.save({ValidateBaforeSave: false});

    const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/auth/resetpassword/${resetToken}`

    const message = `You are receiving this email because you or someone else has requested the reset of a password.
                    please make a request to: \n \n ${resetUrl}`;

          const options = {
            email: user.email,
            subject: "Reset Password",
            emailBody: message,
          }

          try {
            await sendEmail(options);

            return res.status(200).json({sucess: true, message: "Email sent"});
          } catch(error){
            console.log(error);

            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save({ValidateBaforeSave: false});

            return res
            .status(500)
            .json({success: false, message: "Something went wrong"});
          }
};
const resetPassword = async (req, res) => {

    const resetPasswordToken = crypto
           .createHash('sha256')
           .update(req.params.resettoken)
           .digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()},
    });

    if (!user) {
        return res.status(400).json({success: false, message: "invalid password"})
    }

    // set password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return res
        .status(200)
        .json({success: true, message: "Password Changed Successfully"})
 };
 



module.exports = {register, login, updateDetails, updatePassword, forgotPassword, resetPassword};