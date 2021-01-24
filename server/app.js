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
    user ? res.status(200).send(user) : res.sendStatus(404);
  } catch (err) {
    res.status(500).send({ message: 'Server Error' });
  }
});

app.get('/users/:userId/id', async (req, res) => {
  try {
    const id = await getUserNameAndPhoto(req.params.userId);
    id ? res.status(200).send(id) : res.sendStatus(404);
  } catch (err) {
    res.status(500).send({ message: 'Server Error' });
  }
});

app.get('/users/:userId/super', async (req, res) => {
  try {
    const status = await getUserSuperhostStatus(req.params.userId);
    status ? res.status(200).send(status) : res.sendStatus(404);
  } catch (err) {
    res.status(500).send({ message: 'Server Error' });
  }
});

module.exports = app;