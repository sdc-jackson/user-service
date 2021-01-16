const app = require('./app.js');
const PORT = 5007;

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});