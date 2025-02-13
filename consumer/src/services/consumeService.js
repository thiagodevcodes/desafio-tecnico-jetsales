

const { logMessage } = require("./logService")
const { sendMessageWhatsApp  } = require('../services/whatsappService.js');
const amqp = require('amqplib');


const QUEUE_NAME = process.env.QUEUE_NAME;
const RABBITMQ_URL = process.env.RABBITMQ_URL;
let channel, connection;

async function connectRabbitMQ() {
    try {
        if (!connection) {
            connection = await amqp.connect(RABBITMQ_URL);
            channel = await connection.createChannel();
            await channel.assertQueue(QUEUE_NAME);
            console.log('Conexão com RabbitMQ estabelecida.');
        }
    } catch (err) {
        console.error('Erro ao conectar ao RabbitMQ:', err);
    }
}

async function consumeMessages() {
    if (!channel) {
        console.error('RabbitMQ não está conectado! Verifique a conexão.');
        return;
    }

    console.log('Aguardando mensagens na fila...');

    channel.consume(QUEUE_NAME, async (msg) => {
        if (!msg) {
            console.warn("Mensagem vazia recebida, ignorando...");
            return;
        }

        try {
            const messageContent = msg.content.toString();
            console.log("Mensagem recebida:", messageContent);

            const { phone, message } = JSON.parse(messageContent);

            if (!phone || !message) {
                throw new Error("Mensagem inválida: Campos 'phone' ou 'message' estão ausentes.");
            }

            const isSend = await sendMessageWhatsApp(phone, message);
            if (isSend) logMessage(phone, message, "200")
            
            // Confirma que a mensagem foi processada com sucesso
            channel.ack(msg);
        } catch (err) {
            console.error('Erro ao processar mensagem');
            channel.nack(msg, false, false); // Rejeitar mensagem sem reencaminhamento
        }
    });
}

async function closeRabbitMQConnection() {
    try {
        if (channel) {
            await channel.close();
            console.log('Canal RabbitMQ fechado.');
        }
        if (connection) {
            await connection.close();
            console.log('Conexão RabbitMQ fechada.');
        }
    } catch (error) {
        console.error('Erro ao fechar conexão RabbitMQ:', error);
    }
}

// Fecha a conexão ao encerrar o servidor
process.on('SIGINT', async () => {
    console.log('Encerrando servidor...');
    await closeRabbitMQConnection();
    process.exit(0);
});

async function startConsumer() {
  await connectRabbitMQ();
  await consumeMessages();
}

module.exports = {
    startConsumer
}