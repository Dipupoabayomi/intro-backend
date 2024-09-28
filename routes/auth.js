const express = require('express');

const { register, login, updateDetails, updatePassword, forgotPassword, resetPassword } = require('../controller/auth');


const router = express.Router();

router.post('/register', register)
router.post("/login", login)
router.post("/forgotpassword", forgotPassword)
router.put("/updatedetails/:id", updateDetails)
router.put("/updatepassword/:id", updatePassword)
router.put("/resetpassword/:resettoken", resetPassword)


module.exports = router;