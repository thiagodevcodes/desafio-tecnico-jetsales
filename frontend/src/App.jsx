import { useState, useEffect } from "react";

function App() {
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [connected, setConnected] = useState(false);
  const [phone, setPhone] = useState([]);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState('waiting_for_qr');

  let baseUrlConsumer = "http://localhost:3000"
  let baseUrlProducer = "http://localhost:4000"

  const checkStatus = async () => {
    const response = await fetch(`${baseUrlConsumer}/api/status`);
    const data = await response.json();
    return data; // "connected" ou "disconnected"
  };

  useEffect(() => {
    const getStatus = async () => {
      const data = await checkStatus();
      setStatus(data.status);
      setQrCodeUrl(data.currentQrCode);

      if (data.status === "CONNECTED") {
        setConnected(true);
      } else {
        setConnected(false);
      }
    };

    getStatus();

    const intervalId = setInterval(() => {
      getStatus();
    }, 10000);

    // Limpeza: para parar o intervalo quando o componente for desmontado
    return () => clearInterval(intervalId);
  }, []); // O segundo argumento vazio [] significa que o useEffect roda apenas uma vez, como se fosse "componentDidMount"

  const sendMessage = async () => {
    try {
      const response = await fetch(`${baseUrlProducer}/api/send-message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, message }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || `Erro desconhecido (${response.status})`;
        throw new Error(errorMessage);
      }

      alert("Mensagem enviada com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      alert(`Erro ao enviar mensagem: ${error.message}`);
    }
  };


  return (
    <div className="container">
      {
        qrCodeUrl && status == "QR_REQUIRED" &&
        <div className="qrcode-box">
          <h1 className="">Escaneie o QR Code:</h1>
          <img src={qrCodeUrl} alt="QR Code para conectar ao WhatsApp" className="rounded-xl" />
        </div>
      }

      {
        status == "READY" &&
        <>

          <div className="qrcode-box">
            <h1 className="">WhatsApp Send</h1>
            <div className="input-box">
              <input
                type="text"
                id="inputArray"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Número de telefone"
                className=""
              />


            </div>
            <div className="input-box">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Mensagem a ser enviada"
                className=""
              ></textarea>
            </div>

            <div className="input-box">
              <button onClick={sendMessage} className="">
                Enviar Mensagem
              </button>
            </div>

          </div>
        </>

      }

    </div>
  );
}

export default App;