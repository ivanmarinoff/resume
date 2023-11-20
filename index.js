const http = require('http');
const port = 8080;
const fs = require('fs');
const express = require('express');
const app = express();

// Serve static files from the "static" directory
app.use(express.static('static'));

// Set up your index route
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

// Start the server
app.listen(port, function () {
  console.log(`Server is listening on port ${port}`);
});