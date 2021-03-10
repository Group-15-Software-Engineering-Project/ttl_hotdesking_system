const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Database connection
var con = mysql.createConnection({
  host : process.env.DB_ENDPOINT,
  port : process.env.DB_PORT,
  user : process.env.DB_USER_ID,
  password : process.env.DB_PASS,
  database : process.env.DATABASE
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

//API calls
app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.post('/api/world', (req, res) => {
  console.log(req.body);
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`,
  );
});

//Database interaction
class AddUser {
  constructor() {}  
  status;
  //Add users takes an email (as a string) and adds it to the database
  async addUser(email) {
    //let query = "DELETE FROM USERS;";  //
    let query = "INSERT INTO USERS VALUES (\"" + email + "\")";
    await con.query(query, (err, res, fields) => {
      if (err) this.status = 1; else this.status = 0;
    }); 
    return this.status;
  }
}

class GetUsers {
  constructor() {}  
  status;
  //Gets all users in the database
  async getUsers() {
    let query = "SELECT * FROM USERS;";
    await con.query(query, (err, res, fields) => {
      console.log(res);
      if (err) this.status = 1; else this.status = 0; 
    }); 
    return this.status;
  }
}



//Environment

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
    
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}


//console.log(database.addUser("mkelly32@tcd.ie"));         //Test call 
//console.log(database.status);

app.listen(port, () => console.log(`Listening on port ${port}`));