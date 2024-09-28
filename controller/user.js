const User = require('../models/user');

// function to get all users
const getAllUsers = async (req, res) => {
    const user = await User.find();

    res.status(200).json({ user })
}


// function to get a single user
const getUser = async (req, res) =>{
    const user = await User.findById(req.params.id);

    res.status(200).json({success: true, user});
}

// function to delete user

const deleteUser = async (req, res) =>{
    const user = await User.findByIdAndDelete(req.params.id);

    res.status(200).json({success: true, messge:"User deleted successfully"})
}



module.exports = {getAllUsers, getUser, deleteUser};