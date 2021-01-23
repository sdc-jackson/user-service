const express = require('express');
const app = express();
const { getUserById, getUserNameAndPhoto, getUserSuperhostStatus } = require('./database/helpers');

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

app.get('/users/:userId/id', async (req, res) => {
  try {
    const id = await getUserNameAndPhoto(req.params.userId);
    res.status(200).send(id);
  } catch (err) {
    res.status(500).send({ message: 'Server Error' });
  }
});

app.get('/users/:userId/super', async (req, res) => {
  try {
    const status = await getUserSuperhostStatus(req.params.userId);
    res.status(200).send(status);
  } catch (err) {
    res.status(500).send({ message: 'Server Error' });
  }
});

module.exports = app;