const express = require('express');
const cors = require('cors');
require('dotenv').config();

const consumeRoutes = require('./src/routes/consumeRoutes');
const { initWhatsApp } = require('./src/services/whatsappService');
const { startConsumer } = require('./src/services/consumeService')

// Configuração do WhatsApp, PostgreSQL, e RabbitMQ

const PORT = 3000;
const app = express();

// Conecta-se ao RabbitMQ e começa a consumir mensagens

app.use(cors());
app.use(express.json());

app.use('/api', consumeRoutes);

initWhatsApp()
startConsumer()

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});



