const express = require('express');
const app = express();
const PORT = 5007;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile('index.html');
});

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});