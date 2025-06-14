const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

// Shërben skedarët statikë nga folderi aktual
app.use(express.static(path.join(__dirname)));

// Nëse dikush kërkon `/`, i japim index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Serveri po funksionon në portin ${PORT}`);
});
