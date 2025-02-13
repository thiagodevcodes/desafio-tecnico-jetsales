

const { Client: PGClient } = require('pg');

const POSTGRES_CONFIG = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  };


const dbClient = new PGClient(POSTGRES_CONFIG);

async function connectDatabase() {
    try {
        await dbClient.connect();
        console.log('Conexão com o banco de dados PostgreSQL estabelecida com sucesso!');
    } catch (err) {
        console.error('Erro ao conectar ao banco de dados PostgreSQL:', err);
    }
}

async function logMessage(phone, message, status) {
    try {
        await dbClient.query(
            'INSERT INTO message_logs (phone, message, status) VALUES ($1, $2, $3)',
            [phone, message, status]
        );
        console.log(`Log registrado: ${phone}, Status: ${status}`);
    } catch (err) {
        console.error('Erro ao salvar log:', err);
    }
}

connectDatabase();

module.exports = {
    logMessage
}