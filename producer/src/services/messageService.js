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

async function sendMessageToQueue(phone, message) {
  try {
    await connectRabbitMQ(); // Garante que a conexão foi iniciada

    if (!channel) {
      throw new Error('Canal RabbitMQ não está configurado.');
    }

    const messageString = JSON.stringify({ phone, message });
    channel.sendToQueue(QUEUE_NAME, Buffer.from(messageString));
    console.log(`Mensagem enviada para a fila "${QUEUE_NAME}": ${messageString}`);
    
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
  }
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

module.exports = {
  sendMessageToQueue,
  connectRabbitMQ,
  closeRabbitMQConnection,
};