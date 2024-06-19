const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = 8080;
app.use(cors());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

const testAPI = (req, res) => {
  console.log(req.body);
  res.status(200).json({ message: 'Hello from server!' });
};

app.get('/services/test', testAPI);
