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

app.post("/api/adminCheck", (req, res) => {
  adminCheck(req.body.user)
    .then((result) => {
      if (res.length === 1) {
        res.send({ error: false, admin: true });
      } else {
        res.send({ error: false, admin: false });
      }
    })
    .catch((err) => {
      res.send({ error: true, admin: false });
    });
});

app.post("/api/getLocationData", (req, res) => {
  let data = [];
  getRooms()
    .then((rooms) => {
      for (room in rooms) {
        let j = room;
        getDesks(rooms[j]).then((desks) => {
          data.push({ name: rooms[j], desks: desks });
          if (data.length === rooms.length) {
            res.send({ error: false, data: data });
          }
        });
      }
    })
    .catch((err) => {
      res.send({ error: true, data: [] });
    });
});

app.post("/api/getRooms", (req, res) => {
  let locations = [];
  getRooms()
    .then((result) => {
      for (x in result) {
        locations.push({
          value: result[x],
          label: "",
        });
      }
      res.send({ error: false, rooms: locations });
    })
    .catch((err) => {
      console.log(err);
      res.send({ error: true, rooms: [] });
    });
});

app.post("/api/getUsers", (req, res) => {
  getUsers()
    .then((result) => {
      res.send({ error: false, users: result });
    })
    .catch(() => {
      res.send({ error: true, users: [] });
    });
});

app.post("/api/addRoom", (req, res) => {
  addRoom(req.body.room)
    .then(() => {
      res.send({ error: false, message: "Success" });
    })
    .catch((err) => {
      res.send({ error: true, message: err });
    });
});

app.post("/api/addDesk", (req, res) => {
  addDesk(req.body.desk, req.body.room)
    .then(() => {
      res.send({ error: false, message: "Sucess" });
    })
    .catch((err) => {
      res.send({ error: true, message: err });
    });
});

app.post("/api/addUser", (req, res) => {
  addUser(req.body.email, req.body.password)
    .then(() => {
      res.send({ error: false, message: "Success" });
    })
    .catch((err) => {
      res.send({ error: true, message: err });
    });
});

app.post("/api/removeDesk", (req, res) => {
  deleteDeskBookings(req.body.desk, req.body.room)
    .then(() => {
      deleteDesk(req.body.desk, req.body.room);
    })
    .then(() => {
      res.send({ error: false, message: "Success" });
    })
    .catch((err) => {
      res.send({ error: true, message: err });
    });
});

app.post("/api/removeRoom", (req, res) => {
  deleteRoomBookings(req.body.room)
    .then(() => {
      deleteDesksFromRoom(req.body.room);
    })
    .then(() => {
      deleteRoom(req.body.room);
    })
    .then(() => {
      res.send({ error: false, message: "Success" });
    })
    .catch((err) => {
      res.send({ error: true, message: err });
    });
});

app.post("/api/removeUser", (req, res) => {
  deleteUserBookings(req.body.email)
    .then(() => {
      deleteUserFromGroups(req.body.email);
    })
    .then(() => {
      deleteUser(req.body.email);
    })
    .then(() => {
      res.send({ error: false, message: "Success" });
    })
    .catch((err) => {
      res.send({ error: true, message: err });
    });
});

app.post("/api/getBooking", (req, res) => {
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

app.post("/api/getBookingsInMonth", (req, res) => {
  let newDate = new Date(req.body.date + "-01");
  let daysInMonth = new Date(
    newDate.getFullYear(),
    newDate.getMonth() + 1,
    0
  ).getDate();
  let existingBookings = new Array(daysInMonth);
  getDesks(req.body.room)
    .then((desks) => {
      for (let i = 0; i < daysInMonth; i++) {
        let date = req.body.date;
        if (i < 10) {
          date += "-0" + (i + 1).toString();
        } else {
          date += "-" + (i + 1).toString();
        }

        getExistingBookings(req.body.room, date, req.body.am, req.body.pm).then(
          (bookings) => {
            let data = [];
            for (item in bookings) {
              data.push({
                user: bookings[item].USER,
                desk: bookings[item].DESK,
              });
            }
            existingBookings[i] = data;
            if (i == daysInMonth - 1) {
              console.log("desks: ", desks);
              console.log("existingBookings: ", existingBookings);
              res.send({
                error: false,
                existingBookings: existingBookings,
                desks: desks,
              });
            }
          }
        );
      }
    })
    .catch((err) => {
      console.log(err);
      res.send({
        error: true,
        existingBookings: [],
        desks: [],
      });
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
  let existingBookings = new Array(daysInMonth);
  for (let i = 0; i < daysInMonth; i++) {
    let date = req.body.date;
    if (i < 10) {
      date += "-0" + (i + 1).toString();
    } else {
      date += "-" + (i + 1).toString();
    }
    getExistingBookings(req.body.room, date, req.body.am, req.body.pm)
      .then((bookings) => {
        getAvailableDesks(req.body.room, date, req.body.am, req.body.pm).then(
          (desks) => {
            data = [];
            users = [];
            for (desk in desks) {
              data.push(desks[desk].DESK_NO);
            }
            for (email in bookings) {
              users.push(bookings[email].USER);
            }
            availability[i] = data;
            existingBookings[i] = users;
            if (i == daysInMonth - 1) {
              res.send({
                data: availability,
                existingBookings: existingBookings,
              });
            }
          }
        );
      })
      .catch((err) => {
        console.log(err);
        res.send({ date: availability });
      });
  }
});

//Database Access
function addUser(email, password) {
  return new Promise((resolve, reject) => {
    sql = 'INSERT INTO USERS VALUES ("' + email + '", "' + password + '");';
    console.log(sql);
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
  sql = 'INSERT INTO ROOMS VALUES ("' + name + '");';
  console.log(sql);
  return new Promise((resolve, reject) => {
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
  sql = "INSERT INTO DESKS VALUES (" + desk_number + ', "' + room + '");';
  return new Promise((resolve, reject) => {
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

function adminCheck(email) {
  sql = "SELECT * FROM GROUPS WHERE NAME='ADMIN' AND USER='" + email + "';";
  return new Promise((resolve, reject) => {
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
    sql =
      "SELECT * FROM BOOKINGS WHERE USER='" + email + "' ORDER BY DATE DESC;";
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

async function getDesks(room) {
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
    sql = "SELECT DISTINCT * FROM ROOMS;";
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

function getExistingBookings(room, date, am, pm) {
  let times = "";
  if (am && pm) {
    times = "AM=1 AND PM=1";
  } else {
    times = am ? "AM=1 " : "PM=1 ";
  }
  sql =
    'SELECT DISTINCT USER, DESK FROM BOOKINGS WHERE ROOM="' +
    room +
    '" AND DATE="' +
    date +
    '" AND ' +
    times +
    " ORDER BY DESK ASC;";
  return new Promise((resolve, reject) => {
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

function deleteUserFromGroups(email) {
  sql = "DELETE FROM GROUPS WHERE USER='" + email + "';";
  return new Promise((resolve, reject) => {
    con.query(sql, (err, res) => {
      if (err) {
        reject(new Error(err));
      } else {
        resolve(res);
      }
    });
  });
}

function deleteRoomBookings(room) {
  sql = "DELETE FROM BOOKINGS WHERE ROOM='" + room + "';";
  console.log(sql);
  return new Promise((resolve, reject) => {
    con.query(sql, (err, res) => {
      if (err) {
        reject(new Error(res));
      } else {
        resolve(res);
      }
    });
  });
}

function deleteDeskBookings(desk, room) {
  sql = "DELETE FROM BOOKINGS WHERE DESK=" + desk + " AND ROOM='" + room + "';";
  console.log(sql);
  return new Promise((resolve, reject) => {
    con.query(sql, (err, res) => {
      if (err) {
        reject(new Error(err));
      } else {
        resolve(res);
      }
    });
  });
}

function deleteUserBookings(email) {
  sql = "DELETE FROM BOOKINGS WHERE USER='" + email + "';";
  return new Promise((resolve, reject) => {
    con.query(sql, (err, res) => {
      if (err) {
        reject(new Error(err));
      } else {
        resolve(res);
      }
    });
  });
}

function deleteDesksFromRoom(room) {
  sql = "DELETE FROM DESKS WHERE ROOM='" + room + "';";
  console.log(sql);
  return new Promise((resolve, reject) => {
    con.query(sql, (err, res) => {
      if (err) {
        reject(new Error(err));
      } else {
        resolve(res);
      }
    });
  });
}
function deleteRoom(room) {
  sql = "DELETE FROM ROOMS WHERE NAME='" + room + "';";
  console.log(sql);
  return new Promise((resolve, reject) => {
    con.query(sql, (err, res) => {
      if (err) {
        reject(new Error(err));
      } else {
        resolve(res);
      }
    });
  });
}

function deleteDesk(desk, room) {
  sql = "DELETE FROM DESKS WHERE DESK_NO=" + desk + " AND ROOM='" + room + "';";
  console.log(sql);
  return new Promise((resolve, reject) => {
    con.query(sql, (err, res) => {
      if (err) {
        reject(new Error(err));
      } else {
        resolve(res);
      }
    });
  });
}

function deleteUser(email) {
  sql = 'DELETE FROM USERS WHERE email="' + email + '";';
  console.log(sql);
  return new Promise((resolve, reject) => {
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

app.listen(port, () => console.log(`Listening on port ${port}`));
