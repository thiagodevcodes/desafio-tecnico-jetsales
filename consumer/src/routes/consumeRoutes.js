const express = require('express');
const { statusConnection } = require('../services/whatsappService');
const router = express.Router();

router.get('/status', async (req, res) => {
  const data = await statusConnection();  // Obtém o status atual da conexão
  res.json({ status: data.status,  currentQrCode: data.currentQrCode });  // Retorna o status como JSON
});
  

module.exports = router