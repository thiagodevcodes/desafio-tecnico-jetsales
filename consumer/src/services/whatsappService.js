const { Client: WhatsAppClient, LocalAuth } = require('whatsapp-web.js');

const whatsappClient = new WhatsAppClient({
  authStrategy: new LocalAuth(),
});

let whatsappStatus = "";
let currentQrCode = "";

async function initWhatsApp() {
  whatsappClient.on('qr', (qr) => {
      currentQrCode = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qr)}`;
      console.log("Status Whatsapp: QR_REQUIRED")
      whatsappStatus = "QR_REQUIRED";
  });
  
  whatsappClient.on('authenticated', () => {
      console.log("Status Whatsapp: CONNECTED")
      whatsappStatus = "CONNECTED";
  });
  
  whatsappClient.on('ready', async () => {
      console.log("Status Whatsapp: READY")
      whatsappStatus = "READY";
  });

  whatsappClient.on('disconnected', async (reason) => {
    console.log(`WhatsApp desconectado: ${reason}. Tentando reiniciar...`);
  });

  await whatsappClient.initialize();
  return whatsappClient;
}

async function sendMessageWhatsApp(phone, message) {
  try {
    console.log(`Tentando enviar mensagem para ${phone}: "${message}"`);
    const chatId = `${phone}@c.us`;
    await whatsappClient.sendMessage(chatId, message);

    console.log(`Mensagem enviada com sucesso para ${phone}`);
    return true; // Retorna verdadeiro quando o envio for bem-sucedido
  } catch (error) {
    console.error("Erro ao enviar mensagem via WhatsApp:", error);
    return false; // Retorna falso se houver erro
  }
}

async function statusConnection() {
  return {status: whatsappStatus, currentQrCode: currentQrCode}; 
}

module.exports = {
  whatsappClient,
  sendMessageWhatsApp,
  initWhatsApp,
  statusConnection 
};