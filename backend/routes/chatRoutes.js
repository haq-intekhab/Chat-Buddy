const express = require('express');
const router = express.Router();

const { auth } = require('../middleware/authentication');
const { accessChat, fetchChats, createGroupChat, renameGroup, removeFromGroup, addToGroup } = require('../controllers/chatController');

router.route("/").post(auth,accessChat);
router.route("/").get(auth, fetchChats);
router.route("/group").get(auth, createGroupChat);
router.route("/renamegroup").put(auth, renameGroup);
router.route("/groupremove").put(auth, removeFromGroup);
router.route("/groupadd").put(auth, addToGroup);

module.exports = router;
