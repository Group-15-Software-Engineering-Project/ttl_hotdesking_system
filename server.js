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
  database: process.env.DATABASE,
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/api/login", (req, res) => {
  login(req.body.email, req.body.password)
    .then((result) => {
      if (result.length != 0) {
        res.send({ error: false, message: "Success" });
      } else {
        res.send({ error: true, message: "No email with that password" });
      }
    })
    .catch((err) => {
      res.send({ error: true, message: err });
    });
});

app.post("/api/getBooking", (req, res) => {
  console.log(req.body.email);
  getPastBookings(req.body.email)
    .then((bookings) => {
      data = [];
      for (booking in bookings) {
        data.push(bookings[booking]);
      }
      res.send({ data });
    })
    .catch((err) => {
      res.send({ error: true, message: err.toString() });
    });
});

app.post("/api/makeBooking", (req, res) => {
  console.log(req.body.email);
  addBooking(
    req.body.email,
    req.body.desk,
    req.body.room,
    req.body.date,
    req.body.am,
    req.body.pm
  )
    .then((result) => {
      res.send({ error: false, message: "Success" });
    })
    .catch((err) => {
      res.send({ error: true, message: err.toString() });
    });
});

app.post("/api/getAvailableDesksInMonth", (req, res) => {
  let newDate = new Date(req.body.date + "-01");
  let daysInMonth = new Date(
    newDate.getFullYear(),
    newDate.getMonth() + 1,
    0
  ).getDate();
  let availability = new Array(daysInMonth);
  for (let i = 0; i < daysInMonth; i++) {
    let j = i;
    let date = req.body.date;
    if (i < 10) {
      date += "-0" + (i + 1).toString();
    } else {
      date += "-" + (i + 1).toString();
    }
    getAvailableDesks(req.body.room, date, req.body.am, req.body.pm)
      .then((desks) => {
        data = [];
        for (desk in desks) {
          data.push(desks[desk].DESK_NO);
        }
        availability[j] = data;
        if (i == daysInMonth - 1) {
          res.send({ data: availability });
        }
      })
      .catch((err) => {
        console.log(err);
        data.push([]);
      });
  }
});

//Database Access
function addUser(email) {
  email = email.toLowerCase();
  return new Promise((resolve, reject) => {
    sql = 'INSERT INTO USERS VALUES ("' + email + '");';
    con.query(sql, (err, res) => {
      if (err) {
        reject(new Error(err));
      } else {
        resolve(res);
      }
    });
    con.query;
  });
}

function addRoom(name) {
  return new Promise((resolve, reject) => {
    sql = 'INSERT INTO ROOMS VALUES ("' + name + '");';
    con.query(sql, (err, res) => {
      if (err) {
        reject(new Error(err));
      } else {
        resolve(res);
      }
    });
  });
}

function addDesk(desk_number, room) {
  return new Promise((resolve, reject) => {
    sql = "INSERT INTO DESKS VALUES (" + desk_number + ', "' + room + '");';
    con.query(sql, (err, res) => {
      if (err) {
        reject(new Error(err));
      } else {
        resolve(res);
      }
    });
  });
}

function login(email, password) {
  return new Promise((resolve, reject) => {
    sql =
      "SELECT * FROM USERS WHERE email='" +
      email +
      "' AND password='" +
      password +
      "';";
    con.query(sql, (err, res) => {
      if (err) {
        reject(new Error(err));
      } else {
        resolve(res);
      }
    });
  });
}
function getPastBookings(email) {
  return new Promise((resolve, reject) => {
    sql = "SELECT * FROM BOOKINGS WHERE USER='" + email + "';";
    con.query(sql, (err, res) => {
      if (err) {
        reject(new Error(err));
      } else {
        resolve(res);
      }
    });
  });
}

function addBooking(user, desk, room, date, am, pm) {
  let time;
  if (am && pm) {
    time = "1, 1";
  } else {
    time = am ? "1, 0" : "0, 1";
  }
  return new Promise((resolve, reject) => {
    sql =
      'INSERT INTO BOOKINGS VALUES ("' +
      user +
      '", ' +
      desk +
      ', "' +
      room +
      '", "' +
      date +
      '", ' +
      time +
      ");";
    con.query(sql, (err, res) => {
      if (err) {
        reject(new Error(err));
      } else {
        resolve(res);
      }
    });
  });
}

function getAvailableDesks(room, date, am, pm) {
  let times = "";
  if (am && pm) {
    times = "(BOOKINGS.AM=1 OR BOOKINGS.PM=1) ";
  } else {
    times = am ? "BOOKINGS.AM=1 " : "BOOKINGS.PM=1 ";
  }
  return new Promise((resolve, reject) => {
    sql =
      'SELECT DESK_NO FROM DESKS where ROOM="' +
      room +
      '" AND NOT DESK_NO IN (SELECT DISTINCT BOOKINGS.DESK FROM DESKS RIGHT JOIN BOOKINGS ON DESKS.ROOM=BOOKINGS.ROOM where BOOKINGS.ROOM="' +
      room +
      '" AND ' +
      times +
      'AND BOOKINGS.DATE="' +
      date +
      '");';
    con.query(sql, (err, res) => {
      if (err) {
        reject(new Error(err));
      } else {
        resolve(res);
      }
    });
  });
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
    });
  });
}

function getDesks(room) {
  return new Promise((resolve, reject) => {
    sql = 'SELECT * FROM DESKS WHERE room = "' + room + '";';
    con.query(sql, (err, res) => {
      if (err) {
        reject(new Error(err));
      } else {
        let results = [];
        for (var i in res) {
          results.push(res[i].DESK_NO);
        }
        resolve(results);
      }
    });
  });
}

function getRooms() {
  return new Promise((resolve, reject) => {
    sql = "SELECT * FROM ROOMS;";
    con.query(sql, (err, res) => {
      if (err) {
        reject(new Error(err));
      } else {
        let results = [];
        for (var i in res) {
          results.push(res[i].NAME);
        }
        resolve(results);
      }
    });
  });
}

function getBookingsForRoomAndDay(room, date) {
  return new Promise((resolve, reject) => {
    day = date.toISOString().slice(0, 10);
    sql =
      'SELECT * FROM BOOKINGS WHERE ROOM="' +
      room +
      '" AND DATE="' +
      day +
      '";';
    console.log(sql);
    con.query(sql, (err, res) => {
      if (err) {
        reject(new Error(err));
      } else {
        resolve(res);
      }
    });
  });
}

function getUserBookingsBetween(user, start, end) {
  return new Promise((resolve, reject) => {
    startDay = start.toISOString().slice(0, 10);
    endDay = end.toISOString().slice(0, 10);
    sql =
      'SELECT * FROM BOOKINGS WHERE DATE>"' +
      startDay +
      '" AND DATE<"' +
      endDay +
      '";';
    con.query(sql, (err, res) => {
      if (err) {
        reject(new Error(res));
      } else {
        resolve(res.length);
      }
    });
  });
}

function deleteUser(email) {
  email = email.toLowerCase();
  return new Promise((resolve, reject) => {
    sql = 'DELETE FROM USERS WHERE email="' + email + '";';
    con.query(sql, (err, res) => {
      if (err) {
        reject(new Error(res));
      } else {
        resolve(res);
      }
    });
  });
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
addUser("mikekelly7654@gmail.com")
.then((res) => {
  console.log(res);
})
.catch((err) => {
  console.log("Promise rejection: " + err);
})
*/
app.listen(port, () => console.log(`Listening on port ${port}`));
