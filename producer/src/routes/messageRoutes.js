const express = require('express');
const router = express.Router();
const { sendMessage } = require("../controllers/messageController")
// const { whatsappClient, statusConnection } = require("../../../src/services/whatsappService")

router.post('/send-message', sendMessage);

module.exports = router;