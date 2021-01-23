const express = require('express');
const app = express();
const { getUserById } = require('./database/helpers');

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile('index.html');
});

app.get('/users/:userId', async (req, res) => {
  try {
    const user = await getUserById(req.params.userId);
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send({ message: 'Server Error' });
  }
});

module.exports = app;