const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const db = [];

app.post('/add-data-to-db/', (req, res) => {
  db.push(req.body);
  res.sendStatus(200);
});

app.get('/get-country-city/', (req, res) => {
  res.send(JSON.stringify(db));
})

app.get('/status/', (req, res) => {
  res.sendStatus(200);
});

app.listen(8000, () => console.log('App is running'));
