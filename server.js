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
  dateStrings: ["DATE", "DATETIME"],
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/api/login", (req, res) => {
  console.log(req.body.password);
  login(req.body.email, req.body.password)
    .then((result) => {
      adminCheck(req.body.email)
        .then((admin) => {
          console.log(admin);
          if (result.length != 0) {
            res.send({ error: false, admin: admin, message: "Success" });
          } else {
            res.send({
              error: true,
              admin: admin,
              message: "No email with that password",
            });
          }
        })
        .catch((err) => {
          res.send({ error: true, admin: false, message: "error" });
        });
    })
    .catch((err) => {
      res.send({ error: true, admin: false, message: err.toString() });
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

app.post("/api/getBookingsCount", (req, res) => {
  getBookingsCount(req.body.email)
    .then((result) => {
      console.log("count: ", count);
    })
    .catch((err) => {
      res.send({ error: true, count: 0 });
    });
});

app.post("/api/getUserName", (req, res) => {
  getUserName(req.body.email)
    .then((result) => {
      if (result.length === 0) {
        res.send({ error: true, username: req.body.email });
      } else {
        console.log(result[0].username);
        res.send({ error: false, username: result[0].username });
      }
    })
    .catch((err) => {
      res.send({ error: true, username: req.body.email });
    });
});

app.post("/api/setUserName", (req, res) => {
  setUserName(req.body.email, req.body.username)
    .then(() => {
      res.send({ error: false });
    })
    .catch((err) => {
      res.send({ error: true });
    });
});

app.post("/api/changePassword", (req, res) => {
  console.log("enteredChangePassword");
  changePassword(req.body.email, req.body.password)
    .then(() => {
      res.send({ error: false });
    })
    .catch((err) => {
      res.send({ error: true });
    });
});
app.post("/api/getNotifications", (req, res) => {
  let x = req.body.x;
  console.log("enter notifications");
  getNotifications()
    .then((result) => {
      console.log(result);
      res.send({ error: false, notifications: result });
    })
    .catch((err) => {
      console.log("sql err");
      res.send({ error: true, notifications: [] });
    });
});

app.post("/api/addNotification", (req, res) => {
  console.log("enetered add NOt");
  addNotification(req.body.start, req.body.end, req.body.type, req.body.title, req.body.body)
    .then(() => {
      res.send({ error: false });
    })
    .catch((err) => {
      res.send({ error: true });
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

app.post("/api/getTeams", (req, res) => {
  let teams = [];
  getTeams()
    .then((result) => {
      for (x in result) {
        teams.push(result[x]);
      }
      res.send({ error: false, teams: teams });
    })
    .catch((err) => {
      console.log(err);
      res.send({ error: true, teams: [] });
    });
});

app.post("/api/getUsersInTeam", (req, res) => {
  let users = [];
  getUsersInTeam(req.body.team)
    .then((result) => {
      for (x in result) {
        users.push(result[x]);
      }
      res.send({ error: false, users: users });
    })
    .catch((err) => {
      console.log(err);
      res.send({ error: true, users: [] });
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

app.post("/api/addUserToTeam", (req, res) => {
  addUserToGroup(req.body.email, req.body.group)
    .then(() => {
      res.send({ error: false });
    })
    .catch((err) => {
      console.log(err);
      res.send({ error: true });
    });
});

app.post("/api/removeUserFromTeam", (req, res) => {
  removeUserFromGroup(req.body.email, req.body.group)
    .then(() => {
      res.send({ error: false });
    })
    .catch((err) => {
      console.log(err);
      res.send({ error: true });
    });
});

app.post("/api/addUser", (req, res) => {
  addUser(req.body.email, req.body.password)
    .then(() => {
      addUserToGroup(req.body.email, "All Users")
      .then(() => {
        res.send({ error: false, message: "Success" });
      })
      .catch((err) => {
        res.send({error:true, message: err.toString()});
      });
    })
    .catch((err) => {
      res.send({ error: true, message: err.toString() });
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
  console.log(res.body);
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

app.post("/api/deleteBooking", (req, res) => {
  console.log(req);
  deleteBooking(
    req.body.user,
    req.body.desk,
    req.body.room,
    req.body.date,
    req.body.am,
    req.body.pm
  )
    .then(() => {
      res.send({ error: false });
    })
    .catch((err) => {
      res.send({ error: true });
    });
});

app.post("/api/getBooking", (req, res) => {
  getPastBookings(req.body.email)
    .then((bookings) => {
      data = [];
      for (booking in bookings) {
        data.push(bookings[booking]);
      }
      res.send({ data: bookings });
    })
    .catch((err) => {
      res.send({ error: true, message: err.toString() });
    });
});

app.post("/api/getReports", (req, res) => {
  array = [];
  getReportsByUser(req.body.time, req.body.room, req.body.team)
    .then((bookings) => {
      data = [];
      for (booking in bookings) {
        data.push(bookings[booking]);
      }

      getReportsByDesk(req.body.time, req.body.room, req.body.team).then((bookings) => {
        deskData = [];
        for (booking in bookings) {
          deskData.push(bookings[booking]);
        }
        array = getMostActiveUser(data);
        labels = array[0];
        amountOfBookings = array[1];
        array = getMostActiveDesk(deskData);
        desks = array[0];
        deskBookings = array[1];
        activeDays = getMostActiveDay(data);
        res.send({ labels, amountOfBookings, desks, deskBookings, activeDays });
      });
    })
    .catch((err) => {
      res.send({ error: true, message: err.toString() });
    });
});

function getMostActiveDesk(data) {
  desk = [];
  deskBookings = [];
  if (data !== null) {
    console.log("success");

    desk.push(data[0].DESK);

    var count = 0;
    for (var i = 0; i < data.length; i++) {
      if (desk[0] === data[i].DESK) {
        count++;
      }
    }
    deskBookings.push(count);

    for (var i = 0; i < data.length; i++) {
      if (desk[desk.length - 1] !== data[i].DESK) {
        desk.push(data[i].DESK);
        count = 0;
        for (var j = 0; j < data.length; j++) {
          if (desk[desk.length - 1] === data[j].DESK) {
            count++;
          }
        }
        deskBookings.push(count);
      }
    }
  }
  return [desk, deskBookings];
}

function getMostActiveDay(data) {
  var date = new Date(data[0].DATE);
  var day = date.getDay();
  mostActiveDays = new Array(0, 0, 0, 0, 0, 0, 0);
  for (var i = 0; i < data.length; i++) {
    date = new Date(data[i].DATE);
    day = date.getDay();
    addToDay = mostActiveDays[day] + 1;
    mostActiveDays.splice(day, 1, addToDay);
  }

  return mostActiveDays;
}
function getMostActiveUser(data) {
  labels = [];
  amountOfBookings = [];
  labels.push(data[0].USER);
  //console.log(labels.length-1);
  var countOfBookings;
  var tmp = 0;
  for (var i = 0; i < data.length; i++) {
    if (labels[labels.length - 1] !== data[i].USER) {
      labels.push(data[i].USER);
      amountOfBookings.push(i - tmp);
      tmp = i;
    }
    countOfBookings = i - tmp;
  }
  amountOfBookings.push(countOfBookings + 1);
  if (labels.length === 1) {
    amountOfBookings.push(data.length);
  }
  return [labels, amountOfBookings];
}

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
  let daysInMonth = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0).getDate();
  let existingBookings = new Array(daysInMonth);
  getDesks(req.body.room)
    .then((desks) => {
      for (let i = 0; i < daysInMonth; i++) {
        let k = i;
        let date = req.body.date;
        if (i < 10) {
          date += "-0" + (i + 1).toString();
        } else {
          date += "-" + (i + 1).toString();
        }

        getExistingBookings(req.body.room, date, req.body.am, req.body.pm).then((bookings) => {
          let data = [];
          for (j = 0; j < bookings.length; j++) {
            if (j < bookings.length - 1 && bookings[j + 1].DESK === bookings[j].DESK) {
              data.push({
                user:
                  bookings[j].USER === bookings[j + 1].USER
                    ? bookings[j].USER
                    : bookings[j].USER + "|" + bookings[j + 1].USER,
                desk: bookings[j].DESK,
              });
              j++;
            } else {
              data.push({
                user: bookings[j].USER,
                desk: bookings[j].DESK,
              });
            }
          }
          existingBookings[k] = data;
          if (k == daysInMonth - 1) {
            console.log("desks: ", desks);
            console.log("existingBookings: ", existingBookings);
            res.send({
              error: false,
              existingBookings: existingBookings,
              desks: desks,
            });
          }
        });
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
  let daysInMonth = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0).getDate();
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
        getAvailableDesks(req.body.room, date, req.body.am, req.body.pm).then((desks) => {
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
        });
      })
      .catch((err) => {
        console.log(err);
        res.send({ date: availability });
      });
  }
});

//Database Access
function getMaxNotifcationID() {
  sql = "SELECT MAX(ID) FROM NOTIFICATIONS;";
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

function getNotifications() {
  sql = "SELECT * FROM NOTIFICATIONS WHERE END>now() ORDER BY START DESC;";
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

function addNotification(start, end, type, title, body) {
  return new Promise((resolve, reject) => {
    console.log("entered addNotification");
    getMaxNotifcationID()
      .then((res) => {
        console.log(res);
        let sql =
          "INSERT INTO NOTIFICATIONS VALUES (" +
          (res[0]["MAX(ID)"] + 1) +
          ", '" +
          start +
          "', '" +
          end +
          "', '" +
          type +
          "', '" +
          title +
          "', '" +
          body +
          "');";
        console.log(sql);
        con.query(sql, (err, res) => {
          if (err) {
            reject(new Error(err));
          } else {
            resolve(res);
          }
        });
      })
      .catch((err) => {
        reject(new Error(err));
      });
  });
}

function addUser(email, password) {
  return new Promise((resolve, reject) => {
    sql = 'INSERT INTO USERS VALUES ("' + email + '", "' + password + '", null);';
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
  sql = "SELECT * FROM USERS WHERE email='" + email + "' AND password='" + password + "';";
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

function setUserName(email, username) {
  sql = "UPDATE USERS SET username='" + username + "' WHERE email='" + email + "';";
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

function changePassword(email, password) {
  sql = "UPDATE USERS SET password='" + password + "' WHERE email='" + email + "';";
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

function getPastBookings(email) {
  sql = "SELECT * FROM BOOKINGS WHERE USER='" + email + "' ORDER BY DATE DESC;";
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
function getReportsByUser(time, room, team) {
  console.log(team);
  return new Promise((resolve, reject) => {
    if (time === "overall" && room === "overall") {
      sql =
        "SELECT * FROM BOOKINGS WHERE BOOKINGS.USER IN (SELECT USER FROM GROUPS WHERE" +
        team +
        ")";
    } else if (time === "overall" && room !== "overall") {
      sql =
        "select * from BOOKINGS WHERE ROOM='" +
        room +
        "' AND BOOKINGS.USER IN (SELECT USER FROM GROUPS WHERE" +
        team +
        ")";
    } else if (time === "last week" && room === "overall") {
      sql =
        "select * from BOOKINGS where date between date_sub(now(),INTERVAL 1 week) and now() AND BOOKINGS.USER IN (SELECT USER FROM GROUPS WHERE" +
        team +
        ")" +
        " ORDER BY USER;";
    } else if (time === "last month" && room === "overall") {
      sql =
        "select * from BOOKINGS where date between date_sub(now(),INTERVAL 1 MONTH) and now() AND BOOKINGS.USER IN (SELECT USER FROM GROUPS WHERE" +
        team +
        ")" +
        " ORDER BY USER;";
    } else if (time === "last 3 months" && room === "overall") {
      sql =
        "select * from BOOKINGS where date between date_sub(now(),INTERVAL 3 MONTH) and now() AND BOOKINGS.USER IN (SELECT USER FROM GROUPS WHERE" +
        team +
        ")" +
        " ORDER BY USER;";
    } else if (time === "next week" && room === "overall") {
      sql =
        "select * from BOOKINGS where date between now() and date_add(now(),INTERVAL 1 week) AND BOOKINGS.USER IN (SELECT USER FROM GROUPS WHERE" +
        team +
        ")" +
        " ORDER BY USER;";
    } else if (time === "last week" && room !== "overall") {
      sql =
        "select * from BOOKINGS WHERE ROOM='" +
        room +
        "' AND date between  date_sub(now(),INTERVAL 1 week) and now() AND BOOKINGS.USER IN (SELECT USER FROM GROUPS WHERE" +
        team +
        ")" +
        " ORDER BY USER;";
    } else if (time === "last month" && room !== "overall") {
      sql =
        "select * from BOOKINGS WHERE ROOM='" +
        room +
        "' AND date between date_sub(now(),INTERVAL 1 MONTH) and now() AND BOOKINGS.USER IN (SELECT USER FROM GROUPS WHERE" +
        team +
        ")" +
        " ORDER BY USER;";
    } else if (time === "last 3 months" && room !== "overall") {
      sql =
        "select * from BOOKINGS WHERE ROOM='" +
        room +
        "' AND date between date_sub(now(),INTERVAL 3 MONTH) and now() AND BOOKINGS.USER IN (SELECT USER FROM GROUPS WHERE" +
        team +
        ")" +
        " ORDER BY USER;";
    } else if (time === "next week" && room !== "overall") {
      sql =
        "select * from BOOKINGS WHERE ROOM='" +
        room +
        "' AND date between now() and date_add(now(),INTERVAL 1 week) AND BOOKINGS.USER IN (SELECT USER FROM GROUPS WHERE" +
        team +
        ")" +
        " ORDER BY USER;";
    }
    //console.log("success");

    con.query(sql, (err, res) => {
      if (err) {
        reject(new Error(err));
      } else {
        resolve(res);
      }
    });
  });
}

function getReportsByDesk(time, room, team) {
  //console.log("success");
  return new Promise((resolve, reject) => {
    if (time === "overall" && room === "overall") {
      sql =
        "select * from BOOKINGS WHERE BOOKINGS.USER IN (SELECT USER FROM GROUPS WHERE" +
        team +
        ")" +
        "ORDER BY DESK;";
    } else if (time === "overall" && room !== "overall") {
      sql =
        "select * from BOOKINGS WHERE ROOM='" +
        room +
        "' AND BOOKINGS.USER IN (SELECT USER FROM GROUPS WHERE" +
        team +
        ")" +
        "ORDER BY DESK;";
    } else if (time === "last week" && room === "overall") {
      sql =
        "select * from BOOKINGS where date between date_sub(now(),INTERVAL 1 week) and now() AND BOOKINGS.USER IN (SELECT USER FROM GROUPS WHERE" +
        team +
        ")" +
        "ORDER BY DESK;";
    } else if (time === "last month" && room === "overall") {
      sql =
        "select * from BOOKINGS where date between date_sub(now(),INTERVAL 1 MONTH) and now() AND BOOKINGS.USER IN (SELECT USER FROM GROUPS WHERE" +
        team +
        ")" +
        "ORDER BY DESK;";
    } else if (time === "last 3 months" && room === "overall") {
      sql =
        "select * from BOOKINGS where date between date_sub(now(),INTERVAL 3 MONTH) and now() AND BOOKINGS.USER IN (SELECT USER FROM GROUPS WHERE" +
        team +
        ")" +
        "ORDER BY DESK;";
    } else if (time === "next week" && room === "overall") {
      sql =
        "select * from BOOKINGS where date between now() and date_add(now(),INTERVAL 1 week) AND BOOKINGS.USER IN (SELECT USER FROM GROUPS WHERE" +
        team +
        ")" +
        "ORDER BY DESK;";
    } else if (time === "last week" && room !== "overall") {
      sql =
        "select * from BOOKINGS WHERE ROOM='" +
        room +
        "' AND date between  date_sub(now(),INTERVAL 1 week) and now() AND BOOKINGS.USER IN (SELECT USER FROM GROUPS WHERE" +
        team +
        ")" +
        "ORDER BY DESK;";
    } else if (time === "last month" && room !== "overall") {
      sql =
        "select * from BOOKINGS WHERE ROOM='" +
        room +
        "' AND date between date_sub(now(),INTERVAL 1 MONTH) and now() AND BOOKINGS.USER IN (SELECT USER FROM GROUPS WHERE" +
        team +
        ")" +
        "ORDER BY DESK;";
    } else if (time === "last 3 months" && room !== "overall") {
      sql =
        "select * from BOOKINGS WHERE ROOM='" +
        room +
        "' AND date between date_sub(now(),INTERVAL 3 MONTH) and now() AND BOOKINGS.USER IN (SELECT USER FROM GROUPS WHERE" +
        team +
        ")" +
        "ORDER BY DESK;";
    } else if (time === "next week" && room !== "overall") {
      sql =
        "select * from BOOKINGS WHERE ROOM='" +
        room +
        "' AND date between now() and date_add(now(),INTERVAL 1 week) AND BOOKINGS.USER IN (SELECT USER FROM GROUPS WHERE" +
        team +
        ")" +
        "ORDER BY DESK;";
    }
    //console.log("success");

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
    sql = "SELECT email FROM USERS;";
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

function getUserName(email) {
  sql = "SELECT username FROM USERS WHERE email='" + email + "';";
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

function getBookingsCount(email) {
  sql = "SELECT COUNT(USER) FROM BOOKINGS WHERE USER='" + email + "';";
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

function getRooms() {
  sql = "SELECT DISTINCT * FROM ROOMS;";
  return new Promise((resolve, reject) => {
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
function getUsersInTeam(team) {
  return new Promise((resolve, reject) => {
    sql = "select USER FROM GROUPS WHERE NAME ='" + team + "';";
    con.query(sql, (err, res) => {
      if (err) {
        reject(new Error(err));
      } else {
        let results = [];
        for (var i in res) {
          results.push(res[i].USER);
        }
        resolve(results);
      }
    });
  });
}

function getTeams() {
  return new Promise((resolve, reject) => {
    sql = "SELECT DISTINCT NAME FROM GROUPS;";
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
    times = "(AM=1 OR PM=1) ";
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
    " ORDER BY DESK ASC, AM DESC;";
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
    sql = 'SELECT * FROM BOOKINGS WHERE DATE>"' + startDay + '" AND DATE<"' + endDay + '";';
    con.query(sql, (err, res) => {
      if (err) {
        reject(new Error(res));
      } else {
        resolve(res.length);
      }
    });
  });
}

function removeUserFromGroup(email, group) {
  sql = "DELETE FROM GROUPS WHERE NAME='" + group + "' AND USER='" + email + "';";
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

function addUserToGroup(email, group) {
  sql = "INSERT INTO GROUPS VALUES ('" + group + "', '" + email + "');";
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

function deleteBooking(user, desk, room, date, am, pm) {
  sql =
    "DELETE FROM BOOKINGS WHERE USER='" +
    user +
    "' AND DESK=" +
    desk +
    " AND ROOM='" +
    room +
    "' AND DATE='" +
    date +
    "' AND AM=" +
    am +
    " AND PM=" +
    pm +
    ";";
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
