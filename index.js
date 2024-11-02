const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const routes = require('./routes');

const app = express();

const PORT = process.env.PORT
const TEXT = process.env.TEXT;


app.use(bodyParser.json());

app.use('/', routes);

app.listen(PORT, () => {
  console.log('Server started on port 3000');
});
