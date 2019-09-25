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

app.get('/get-country-city/', (req, res) => {
  connection.query('SELECT country, city, id FROM trip',
    (error, results) => {
      if (error) throw error;
      res.send(JSON.stringify(results));
  });
})

app.get('/get-name-details/:tableName/:id/', (req, res) => {
  connection.query(`SELECT name, details, id FROM ${req.params.tableName} WHERE trip_id='${req.params.id}'`,
    (error, results) => {
      if (error) throw error;
      res.send(JSON.stringify(results));
  });
})

app.get('/status/', (req, res) => {
  res.sendStatus(200);
});

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
      connection.query(`SELECT name, details, trip_id, id FROM ${req.body.type}`,
        (error, results) => {
          if (error) throw error;
          res.send(JSON.stringify(results));
      });
  });
});

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

app.delete('/delete-item/', (req, res) => {
  connection.query(`DELETE FROM ${req.body.tableName} WHERE id='${req.body.id}'`,
    (error, results) => {
      if (error) throw error;
      connection.query(`SELECT name, details, id FROM ${req.body.tableName}`,
        (error, results) => {
          if (error) throw error;
          res.send(JSON.stringify(results));
      });
  });
})

app.delete('/delete-trip/', (req, res) => {
  const tripId = req.body.tripId;

  new Promise((resolve, reject) => {
    connection.query(`DELETE FROM trip WHERE id='${tripId}'`,
      (error, results) => error ? reject(error) : resolve())
  })
  .then(() => new Promise((resolve, reject) => {
    connection.query(`DELETE FROM things_to_do WHERE trip_id='${tripId}'`,
      (error, results) => error ? reject(error) : resolve());
  }))
  .then(() => new Promise((resolve, reject) => {
    connection.query(`DELETE FROM food_drink WHERE trip_id='${tripId}'`,
      (error, results) => error ? reject(error) : resolve());
  }))
  .then(() => new Promise((resolve, reject) => {
    connection.query(`DELETE FROM beaches WHERE trip_id='${tripId}'`,
      (error, results) => error ? reject(error) : resolve());
  }))
  .then(() => new Promise((resolve, reject) => {
    connection.query(`DELETE FROM accommodation WHERE trip_id='${tripId}'`,
      (error, results) => error ? reject(error) : resolve());
  }))
  .then(() => new Promise((resolve, reject) => {
    connection.query(`SELECT country, city, id FROM trip`,
      (error, results) => error ? reject(error) : resolve(res.send(JSON.stringify(results))));
  }));
})

const PORT = process.env.PORT || 8000
app.listen(PORT, () => console.log('App is running'));
