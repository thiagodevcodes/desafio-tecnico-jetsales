const express = require('express');
const cors = require('cors');
require('dotenv').config();


const messageRoutes = require('./src/routes/messageRoutes');

const PORT = 4000;

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', messageRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});