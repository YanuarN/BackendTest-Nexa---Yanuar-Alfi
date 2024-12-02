const express = require('express')
const router = express.Router();
const { getUsers,Register,login,Logout } = require('../controller/userController');


const UserRoutes = () => {
    router.route('/register').post(Register);
    router.route('/').get(getUsers);
    router.route('/login').post(login);
    router.route('/logout').post(login);
    return router
}

module.exports = UserRoutes