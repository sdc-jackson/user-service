const express = require('express');
const app = express();
const cors = require('cors');
const postgres = require('./database/postgresql');

const { getUserById, getUserNameAndPhoto, getUserSuperhostStatus, insertUserInfo, updateUserInfo, deleteUserInfo } = require('./database/helpers');
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));
app.use('/rooms/:id', express.static('public'));
app.use(cors());

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
    res.status(500).send({ message: 'Record was not inserted' });
  }
});

app.post('/users/insertUser', (req, res) => {
  //console.log('req.body : ', req.body);
  insertUserInfo(req.body)
    .then(results => {
      if (results) {
        console.log('input :', results)
        res.status(200).send(results);
      } else {
        res.status(404).send({ message: 'Server Error - Record was not inserted' });
      }
    })
    .catch(err => console.log(err));
})

app.put('/users/updateUser', (req, res) => {
  //console.log(req.body);
  updateUserInfo(req.body)
    .then(results => {
      if (results) {
        //console.log('results: ', results);
        res.status(200).send(results);
      } else {
        res.status(404).send({ message: 'Record was not updated' })
      }
    })
    .catch(err => console.log(err));
});

app.delete('/users/deleteUser', (req, res) => {
  const userInfo = req.body;
  console.log('userId: ', userInfo);
  deleteUserInfo(req.body.userId)
    .then(results => {
      if (results) {
        res.status(200).send(results);
      } else {
        res.status(404).send({ message: 'Record was not deleted' })
      }
    })
    .catch(err => console.log(err));

})

app.post('/hostType', (req, res) => {
  console.log('hostType');
  //res.status(200).send('hostType');
  postgres.insertHostType('Superhost2');
  res.status(200).send('hostType added ');
})

module.exports = app;