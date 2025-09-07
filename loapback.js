const express = require('express');
const app = express();

const HOST = '127.0.0.1';
const PORT = 3000;

//middleware pro jsony
app.use(express.json());

const jsonData = {
  firstName: 'Bilbo',
  lastName: 'Pytlík',
  city: 'Hobitín'
};

// res.json() zajistí lepší chování než res.send(), které pošle i text
app.get('/', (req, res) => {
  res.status(200).json(jsonData);
});

// co pošleš v body, to se ti vrátí
app.post('/loapback', (req, res) => {
  res.json(req.body);
});

// volání aplikace
app.listen(PORT, HOST, () =>
  console.log(`Listening on ${HOST} port ${PORT}...`)
);