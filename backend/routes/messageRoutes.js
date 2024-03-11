const express = require('express');
const router = express.Router();
const {sendMessage, getMessages} = require('../controllers/messageController');
const {auth} = require('../middleware/authentication');


router.route("/").post(auth,sendMessage);
router.route("/:chatId").get(auth,getMessages);

module.exports = router;