const { sendMessageToQueue } = require("../services/messageService")
const { parsePhoneNumberFromString } = require('libphonenumber-js');

function isValidPhone(phone) {
  if (!phone.startsWith('+')) phone = `+${phone}`

  try {
      const phoneNumber = parsePhoneNumberFromString(phone);
      return phoneNumber && phoneNumber.isValid();
  } catch (error) {
      return false;
  }
}

async function sendMessage(req, res) {
  const { phone, message } = req.body;
  try {
    if (!phone || !message) throw new Error("Número ou mensagem em branco");    
    if (!isValidPhone(phone)) throw new Error("Número inválido");

    await sendMessageToQueue(phone, message);
    
    res.status(200).json({ message: "Mensagens enviadas com sucesso!", cod: "200" });
} catch (err) {
    console.error("Erro ao enviar mensagens:", err.message);
    res.status(400).json({ message: err.message, cod: "400" });
}

}

module.exports = {
  sendMessage,
};