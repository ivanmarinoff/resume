const http = require('http');
const port = 3000;
const express = require('express');
const app = express();
const path = require('path')

app.use('/static', express.static(path.join(__dirname, 'static')))

app.set('view engine', 'pug');
app.use(require('body-parser')
  .urlencoded({extended:true}))




// Set up your index route
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

// Start the server
app.listen(port, function () {
  console.log(`Server is listening on port ${port}`);
});