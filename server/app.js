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

// app.get('/users/:userId', async (req, res) => {
//   try {
//     console.log('req.params.userId: ', req.params.userId);
//     const user = await getUserById(req.params.userId);
//     console.log('user from DB : ', user);
//     user ? res.status(200).send(user) : res.sendStatus(404);
//   } catch (err) {
//     res.status(500).send({ message: 'Server Error' });
//   }
// });

app.get('/users/:userId', (req, res) => {

  console.log('req.params.userId: ', req.params.userId);
  getUserById(req.params.userId)
    .then(userDetails => {
      res.status(200).send(userDetails);
    })
    .catch(err => {
      res.status(500).send(err);
    });

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
  postgres.insertHostType('Superhost2');
  res.status(200).send('hostType added ');
})

module.exports = app;