const express = require('express');
const fetch = require('node-fetch');  // Në Node v18+ mund të përdorësh fetch direkt, në versionet më të vjetra instalosh node-fetch
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const TEAMS_WEBHOOK_URL = 'https://outlook.office.com/webhook/...' // Vendos këtu URL-në tënde të webhook-ut Teams

app.post('/notify', async (req, res) => {
  const { client, products } = req.body;
  if (!client || !products || !Array.isArray(products)) {
    return res.status(400).json({ success: false, error: "Të dhëna të paplota" });
  }

  const productsList = products.map(p =>
    `- Modeli: ${p.model}\n  Part Number: ${p.partNumber}\n  Çmimi: ${p.price.toFixed(2)} EUR\n  Përshkrimi: ${p.description}\n  Kërkesat: ${p.requests}\n  Urgjenca: ${p.urgjenca}`
  ).join('\n\n');

  const message = {
    "@type": "MessageCard",
    "@context": "http://schema.org/extensions",
    "summary": `Porosi e re nga ${client}`,
    "themeColor": "b30000",
    "title": `Porosi e re nga ${client}`,
    "text": `Klienti: **${client}**\n\nProduktet:\n${productsList}`
  };

  try {
    const response = await fetch(TEAMS_WEBHOOK_URL, {
      method: "POST",
      body: JSON.stringify(message),
      headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(500).json({ success: false, error: `Gabim në dërgim tek Teams: ${text}` });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Serveri po funksionon në portin ${PORT}`);
});
