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

app.post('/add-section-details-to-db/', (req, res) => {
  connection.query(
    `INSERT INTO ${req.body.type} (name, trip_id, details) VALUES ('${req.body.name}', '${req.body.id}', '${req.body.details}')`,
    (error, results, fields) => {
      if (error) throw error;
  });
  res.sendStatus(200);
});

app.get('/get-country-city/', (req, res) => {
  connection.query('SELECT country, city, id FROM trip',
    (error, results) => {
      if (error) throw error;
      res.send(JSON.stringify(results));
  });
})

app.get('/get-things-to-do-name-details/:id/', (req, res) => {
  connection.query(`SELECT name, details FROM things_to_do WHERE trip_id='${req.params.id}'`,
    (error, results) => {
      console.log(results);
      if (error) throw error;
      res.send(JSON.stringify(results));
  });
})

app.get('/get-food-drink-name-details/:id/', (req, res) => {
  connection.query(`SELECT name, details FROM food_drink WHERE trip_id='${req.params.id}'`,
    (error, results) => {
      if (error) throw error;
      res.send(JSON.stringify(results));
  });
})

app.get('/get-beaches-name-details/:id/', (req, res) => {
  connection.query(`SELECT name, details FROM beaches WHERE trip_id='${req.params.id}'`,
    (error, results) => {
      if (error) throw error;
      res.send(JSON.stringify(results));
  });
})

app.get('/get-accommodation-name-details/:id/', (req, res) => {
  connection.query(`SELECT name, details FROM accommodation WHERE trip_id='${req.params.id}'`,
    (error, results) => {
      if (error) throw error;
      res.send(JSON.stringify(results));
  });
})

app.post('/is-city-exist/', (req, res) => {
  connection.query(`SELECT city FROM trip WHERE city='${req.body.city}'`,
    (error, results) => {
      if (error) throw error;
      res.send(JSON.stringify(results));
  });
})

app.post('/get-country-city-by-id/', (req, res) => {
  connection.query(`SELECT city, country FROM trip WHERE id='${req.body.id}'`,
    (error, results) => {
      if (error) throw error;
      res.send(JSON.stringify(results[0]));
  });
})

app.get('/status/', (req, res) => {
  res.sendStatus(200);
});

app.listen(8000, () => console.log('App is running'));
