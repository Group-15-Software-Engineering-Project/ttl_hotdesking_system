const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mysql = require("mysql");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

var con = mysql.createConnection({
  host: process.env.DB_ENDPOINT,
  user: process.env.DB_USER_ID,
  password: process.env.DB_PASS,
  database: process.env.DATABASE
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//API calls
app.get("/api/hello", (req, res) => {
  res.send({ express: "Hello From Express" });
});

app.post("/api/world", (req, res) => {
  console.log(req.body);
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`
  );
  console.log(req.body.post);
});
app.post("/api/desks", (req, res) => {
  console.log(req.body.chosenDate);
  res.send(
    `Your booking on the ${req.body.chosenDate} for ${req.body.chosenDesk} in ${req.body.chosenArea} has been successful.`
  );
  
});

app.post("/api/email", (req, res) => {
  //console.log(req.body);
  var validUser=false;
  const fs = require("fs");
  let rawdata = fs.readFileSync('MOCK_DATA.json')
  let data =JSON.parse(rawdata);
  	// Do something with your data
    
for(var i =0;i<data.length;i++){
  let x =JSON.stringify(data[i].email);
  console.log(x);
  if(x.charAt(0)==='"'){
  x = x.slice(1, -1);
  }
  if(req.body.email=== x){
    validUser=true; 
    break;
  }
}  

  res.send(
    validUser
  );
  console.log(req.body.email);

});

//Database Access
function addUser(email) {
  email = email.toLowerCase();
  return new Promise((resolve, reject) => {
    sql = "INSERT INTO USERS VALUES (\""+email+"\");";
    con.query(sql, (err, res) => {
      if (err) {
        reject(new Error(err));
      } else {
        resolve(res);
      }
    })
    con.query
  })
}

function addRoom(name) {
  return new Promise((resolve,  reject) => {
    sql = "INSERT INTO ROOMS VALUES (\""+name+"\");"
    con.query(sql, (err, res) => {
      if (err) {
        reject(new Error(err));
      } else {
        resolve(res)
      }
    })
  })
}

function addDesk(desk_number, room) {
  return new Promise((resolve, reject) => {
    sql = "INSERT INTO DESKS VALUES ("+desk_number+", \""+room+"\");";
    con.query(sql, (err, res) => {
      if (err) {
        reject(new Error(err));
      } else {
        resolve(res);
      }
    })
  })
}

function addBooking(user, desk, room, date, time) {
  return new Promise((resolve, reject) => {
    day = date.toISOString().slice(0, 10)
    sql = (time) ? "INSERT INTO BOOKINGS VALUES (\""+user+"\", "+desk+", \""+room+"\", \""+day+"\", 1, 0);" :
      "INSERT INTO BOOKINGS VALUES (\""+user+"\", "+desk+", \""+room+"\", \""+day+"\", 0, 1);";
    con.query(sql, (err, res) => {
      if (err) {
        reject(new Error(err));
      } else {
        resolve(res);
      }
    })

  })
}

function getUsers() {
  return new Promise((resolve, reject) => {
    sql = "SELECT * FROM USERS;";
    con.query(sql, (err, res) => {
      if (err) {
        reject(new Error(err));
      } else {
        let results = [];
        for (var i in res) {
          results.push(res[i].email);
        }
        resolve(results);
      }
    })
  })
}

function getDesks(room) {
  return new Promise((resolve, reject) => {
    sql = "SELECT * FROM DESKS WHERE room = \""+room+"\";"
    con.query(sql, (err, res) => {
      if (err) {
        reject(new Error(err));
      } else {
        let results = []
        for (var i in res) {
          results.push(res[i].DESK_NO);
        }
        resolve(results);
      }
    })
  })
}

function getRooms() {
  return new Promise((resolve, reject) => {
    sql = "SELECT * FROM ROOMS;";
    con.query(sql, (err, res) => {
      if (err) {
        reject(new Error(err));
      } else {
        let results = []
        for (var i in res) {
          results.push(res[i].NAME)
        }
        resolve(results);
      }
    })
  })
}

function getBookingsForRoomAndDay(room, date) {
  return new Promise((resolve, reject) => {
    day = date.toISOString().slice(0, 10);
    sql = "SELECT * FROM BOOKINGS WHERE ROOM=\""+room+"\" AND DATE=\""+day+"\";";
    console.log(sql);
    con.query(sql, (err, res) => {
      if (err) {
        reject(new Error(err));
      } else {
        resolve(res);
      }
    })
  })
}

function getUserBookingsBetween(user, start, end) {
  return new Promise((resolve, reject) => {
    startDay = start.toISOString().slice(0, 10);
    endDay = end.toISOString().slice(0, 10);
    sql = "SELECT * FROM BOOKINGS WHERE DATE>\""+startDay+"\" AND DATE<\""+endDay+"\";";
    con.query(sql, (err, res) => {
      if (err) {
        reject(new Error(res));
      } else {
        resolve(res.length);
      }
    })

  })
}

function deleteUser(email) {
  email = email.toLowerCase();
  return new Promise((resolve, reject) => {
    sql = "DELETE FROM USERS WHERE email=\""+email+"\";";
    con.query(sql, (err, res) => {
      if (err) {
        reject(new Error(res));
      } else {
        resolve(res);
      }
    })
  })
}
//Environment

if (process.env.NODE_ENV === "production") {
  // Serve any static files
  app.use(express.static(path.join(__dirname, "client/build")));

  // Handle React routing, return all requests to React app
  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}
/*
deleteUser("mikekelly7654@gmail.com")//getUserBookingsBetween("mkelly32@tcd.ie", new Date(2021, 3, 10), new Date(2021, 3, 20))
.then((res) => {
  console.log(res);
})
.catch((err) => {
  console.log(err);
})
/*
addUser("mikekelly7654@gmail.com")
.then((res) => {
  console.log(res);
})
.catch((err) => {
  console.log("Promise rejection: " + err);
})
*/
app.listen(port, () => console.log(`Listening on port ${port}`));
