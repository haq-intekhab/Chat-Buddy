const express = require('express');
const router = express.Router();

const {registerUser, loginUser,allUsers} = require('../controllers/userController');
const {auth} = require('../middleware/authentication');

router.route('/').post(registerUser).get(auth,allUsers);
router.post('/login', loginUser);

module.exports = router;