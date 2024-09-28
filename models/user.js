const mongoose = require('mongoose');
const bcrpyt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const UserSchema = mongoose.Schema(
    {
        firstname : {
            type : String,
            required: [true, "please add your firstName"],
            maxlenght: [50, "name must not be more than 5o characters"],
        },
        lastname : {
            type : String,
            required: [true, "please add your lastName"],
            maxlenght: [50, "name must not be more than 5o characters"],
        },
        email: {
            type : String,
            required: [true,"please provide an email"],
            unique: [true,"user already exist"],
            match:[/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/, "Please add a valid email"]
        },
        role: {
            type: String,
            enum: ["user", 'admin'],
            default:"user"
        },
        password: {
            type : String,
            required : [true,"please add a password" ],
            minlenght : [7, "password must be more than 7 characters"],
            select: [false ] 
        },
        resetPasswordToken: String,
        resetPasswordExpire: Date,
        lastPasswordReset: Date,
    }
)
// Encrypt password using bcrpyt
UserSchema.pre('save', async function(next) {
    if(!this.isModified("password")){
        next()
    }
    const salt = await bcrpyt.genSalt(10);
    this.password = await bcrpyt.hash(this.password, salt)
});

UserSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrpyt.compare(enteredPassword, this.password);
}


UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
}
  
 UserSchema.methods.getResetPasswordToken = function (){
    // generate token

    const resetToken = crypto.randomBytes(20).toString('hex');
    try{
        // Hash token and set to resetPasswordToken field
        this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest("hex");

        // set expire
        this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

        return resetToken;

    }catch(err){
        // Handle error
        console.error("Error generating rest password token:", error);
        throw new Error("Failed to generate reset password token");
    }
 }

 

module.exports  = mongoose.model("User", UserSchema);