const jwt = require("jsonwebtoken");
const User = require("../models/user");

const protect = async (req, res, next) => {
    let token;

    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    // make sure token exists
    if(!token){
        return res.status(401)
               .json({message: "No token provided"});
    }

    try{
        // verify token

        const decoded = jwt.verify(token, process.env.JWT_SECERET);

        req.user = await User.findById(decode.id);

        next();
    } catch (err) {
        return res
           .status(401)
           .json({message: "Not authorized to access this route"})
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        // Make sure req.user exsist and role is valid
        if(!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({message: "Not authorized"})
        }

        next();
    };
};


module.exports = {protect, authorize}