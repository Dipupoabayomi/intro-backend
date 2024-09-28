const express = require('express');
const { getAllUsers, getUser, deleteUser } = require('../controller/user');
const { updateDetails } = require('../controller/auth');
const {authorize, protect} = require('../middleware/auth');


const Router = express.Router();

Router.get('/getAllUsers', protect, authorize('admin'), getAllUsers);
Router.get("/user/:id", getUser);
Router.delete('/delete/:id', deleteUser);

module.exports = Router;