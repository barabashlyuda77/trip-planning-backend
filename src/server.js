const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'trip_planning'
});
connection.connect();

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/add-data-to-db/', (req, res) => {
  connection.query(
    `INSERT INTO trip (country, city) VALUES ('${req.body.country}', '${req.body.city}')`,
    (error, results, fields) => {
      if (error) throw error;
  });
  res.sendStatus(200);
});

app.get('/get-country-city/', (req, res) => {
  connection.query('SELECT country, city FROM trip',
    (error, results) => {
      if (error) throw error;
      res.send(JSON.stringify(results));
  });
})

app.post('/is-city-exist/', (req, res) => {
  connection.query(`SELECT city FROM trip WHERE city='${req.body.city}'`,
    (error, results) => {
      if (error) throw error;
      console.log(results);
      res.send(JSON.stringify(results));
  });
})

app.get('/status/', (req, res) => {
  res.sendStatus(200);
});

app.listen(8000, () => console.log('App is running'));
