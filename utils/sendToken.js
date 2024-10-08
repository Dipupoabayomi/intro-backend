// get token from model, and create cookie and send response

const sendTokenResponse = (user, statuscode, res, message) => {
    const token = user.getSignedJwtToken();


    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE *24 * 60 * 60 * 1000),
        httpOnly: true
    }
    if(process.env.NODE_ENV === 'production'){
        options.secure = true;
    }

    res.status(statuscode)
    .cookie('token', token, options)
    .json({success: true, token, message: message || "operation successful" })
};

module.exports = sendTokenResponse;