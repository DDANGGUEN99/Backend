const express = require('express');
const app = express();
var cors = require('cors');

require('dotenv').config();
const port = process.env.HOST_PORT;

const cookieParser = require('cookie-parser');
const router = require('./routes');

// cors
// app.use(cors());
app.use(
  cors({
    origin: '*',
    credentials: 'true',
    // cors options
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use('/api', router);

app.listen(port, () => {
  console.log(`running ${port}`);
});
module.exports = app;
