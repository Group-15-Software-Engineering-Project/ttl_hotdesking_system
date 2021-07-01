const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mysql = require("mysql");
require("dotenv").config();

const routes = require("./api/routes");
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
    console.log("Connected to database");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api", routes);

app.post("/api/login", (req, res) => {
    login(req.body.email, req.body.password)
        .then((result) => {
            adminCheck(req.body.email)
                .then((admin) => {
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
                    res.send({ error: true, admin: false, message: err });
                });
        })
        .catch((err) => {
            res.send({ error: true, admin: false, message: err });
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

app.post("/api/getUserName", (req, res) => {
    getUserName(req.body.email)
        .then((result) => {
            if (result.length === 0) {
                res.send({ error: true, username: req.body.email });
            } else {
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
    getNotifications()
        .then((result) => {
            res.send({ error: false, notifications: result });
        })
        .catch((err) => {
            res.send({ error: true, notifications: [] });
        });
});

app.post("/api/addNotification", (req, res) => {
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
            res.send({ error: true });
        });
});

app.post("/api/removeUserFromTeam", (req, res) => {
    removeUserFromGroup(req.body.email, req.body.group)
        .then(() => {
            res.send({ error: false });
        })
        .catch((err) => {
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
                    res.send({ error: true, message: err });
                });
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

app.post("/api/deleteBooking", (req, res) => {
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
            res.send({ error: true, message: err });
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
            if (bookings.length === 0) {
                res.send({ message: "No data", isError: true });
            } else {
                getReportsByDesk(req.body.time, req.body.room, req.body.team).then(
                    (bookings) => {
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
                        res.send({
                            labels,
                            amountOfBookings,
                            desks,  
                            deskBookings,
                            activeDays,
                            message: "",
                            isError: false,
                        });
                    }
                );
            }
        })
        .catch((err) => {
            res.send({ error: true, message: err.toString() });
        });
});

function getMostActiveDesk(data) {
    desk = [];
    deskBookings = [];
    if (data !== null) {
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
    arr = quickSort(labels, amountOfBookings, 0, labels.length - 1);
    labels = arr[0];
    amountOfBookings = arr[1];
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
            res.send({ error: true, message: err });
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

                getExistingBookings(req.body.room, date, req.body.am, req.body.pm).then(
                    (bookings) => {
                        let data = [];
                        for (j = 0; j < bookings.length; j++) {
                            if (
                                j < bookings.length - 1 &&
                                bookings[j + 1].DESK === bookings[j].DESK
                            ) {
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
                res.send({ date: availability });
            });
    }
});

//Database Access
function getMaxNotifcationID() {
    sql = "SELECT MAX(ID) FROM hotdesking.NOTIFICATIONS;";
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
    sql = "SELECT * FROM hotdesking.NOTIFICATIONS WHERE END>now() ORDER BY START DESC;";
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
        getMaxNotifcationID()
            .then((res) => {
                console.log(res);
                let sql =
                    "INSERT INTO hotdesking.NOTIFICATIONS VALUES (" +
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
        sql =
            'INSERT INTO hotdesking.USERS VALUES ("' + email + '", "' + password + '", null);';
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
    sql = 'INSERT INTO hotdesking.ROOMS VALUES ("' + name + '");';
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
    sql = "INSERT INTO hotdesking.DESKS VALUES (" + desk_number + ', "' + room + '");';
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
    sql =
        "SELECT * FROM hotdesking.USERS WHERE email='" +
        email +
        "' AND password='" +
        password +
        "';";
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
    sql = "SELECT * FROM hotdesking.GROUPS WHERE NAME='ADMIN' AND USER='" + email + "';";
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
    sql =
        "UPDATE hotdesking.USERS SET username='" + username + "' WHERE email='" + email + "';";
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
    sql =
        "UPDATE hotdesking.USERS SET password='" + password + "' WHERE email='" + email + "';";
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
    sql = "SELECT * FROM hotdesking.BOOKINGS WHERE USER='" + email + "' ORDER BY DATE DESC;";
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
    return new Promise((resolve, reject) => {
        if (time === "overall" && room === "overall") {
            sql =
                "SELECT * FROM hotdesking.BOOKINGS WHERE hotdesking.BOOKINGS.USER IN (SELECT USER FROM hotdesking.GROUPS WHERE" +
                team +
                ")";
        } else if (time === "overall" && room !== "overall") {
            sql =
                "select * from hotdesking.BOOKINGS WHERE ROOM='" +
                room +
                "' AND BOOKINGS.USER IN (SELECT USER FROM hotdesking.GROUPS WHERE" +
                team +
                ")";
        } else if (time === "last week" && room === "overall") {
            sql =
                "select * from hotdesking.BOOKINGS where date between date_sub(now(),INTERVAL 1 week) and now() AND hotdesking.BOOKINGS.USER IN (SELECT USER FROM hotdesking.GROUPS WHERE" +
                team +
                ")" +
                " ORDER BY USER;";
        } else if (time === "last month" && room === "overall") {
            sql =
                "select * from hotdesking.BOOKINGS where date between date_sub(now(),INTERVAL 1 MONTH) and now() AND hotdesking.BOOKINGS.USER IN (SELECT USER FROM hotdesking.GROUPS WHERE" +
                team +
                ")" +
                " ORDER BY USER;";
        } else if (time === "last 3 months" && room === "overall") {
            sql =
                "select * from hotdesking.BOOKINGS where date between date_sub(now(),INTERVAL 3 MONTH) and now() AND hotdesking.BOOKINGS.USER IN (SELECT USER FROM GROUPS WHERE" +
                team +
                ")" +
                " ORDER BY USER;";
        } else if (time === "next week" && room === "overall") {
            sql =
                "select * from hotdesking.BOOKINGS where date between now() and date_add(now(),INTERVAL 1 week) AND BOOKINGS.USER IN (SELECT USER FROM GROUPS WHERE" +
                team +
                ")" +
                " ORDER BY USER;";
        } else if (time === "last week" && room !== "overall") {
            sql =
                "select * from BOOKINGS WHERE ROOM='" +
                room +
                "' AND date between  date_sub(now(),INTERVAL 1 week) and now() AND BOOKINGS.USER IN (SELECT USER FROM hotdesking.GROUPS WHERE" +
                team +
                ")" +
                " ORDER BY USER;";
        } else if (time === "last month" && room !== "overall") {
            sql =
                "select * from BOOKINGS WHERE ROOM='" +
                room +
                "' AND date between date_sub(now(),INTERVAL 1 MONTH) and now() AND BOOKINGS.USER IN (SELECT USER FROM hotdesking.GROUPS WHERE" +
                team +
                ")" +
                " ORDER BY USER;";
        } else if (time === "last 3 months" && room !== "overall") {
            sql =
                "select * from BOOKINGS WHERE ROOM='" +
                room +
                "' AND date between date_sub(now(),INTERVAL 3 MONTH) and now() AND BOOKINGS.USER IN (SELECT USER FROM hotdesking.GROUPS WHERE" +
                team +
                ")" +
                " ORDER BY USER;";
        } else if (time === "next week" && room !== "overall") {
            sql =
                "select * from BOOKINGS WHERE ROOM='" +
                room +
                "' AND date between now() and date_add(now(),INTERVAL 1 week) AND BOOKINGS.USER IN (SELECT USER FROM hotdesking.GROUPS WHERE" +
                team +
                ")" +
                " ORDER BY USER;";
        }
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
    return new Promise((resolve, reject) => {
        if (time === "overall" && room === "overall") {
            sql =
                "select * from BOOKINGS WHERE BOOKINGS.USER IN (SELECT USER FROM hotdesking.GROUPS WHERE" +
                team +
                ")" +
                "ORDER BY DESK;";
        } else if (time === "overall" && room !== "overall") {
            sql =
                "select * from BOOKINGS WHERE ROOM='" +
                room +
                "' AND BOOKINGS.USER IN (SELECT USER FROM hotdesking.GROUPS WHERE" +
                team +
                ")" +
                "ORDER BY DESK;";
        } else if (time === "last week" && room === "overall") {
            sql =
                "select * from BOOKINGS where date between date_sub(now(),INTERVAL 1 week) and now() AND BOOKINGS.USER IN (SELECT USER FROM hotdesking.GROUPS WHERE" +
                team +
                ")" +
                "ORDER BY DESK;";
        } else if (time === "last month" && room === "overall") {
            sql =
                "select * from BOOKINGS where date between date_sub(now(),INTERVAL 1 MONTH) and now() AND BOOKINGS.USER IN (SELECT USER FROM hotdesking.GROUPS WHERE" +
                team +
                ")" +
                "ORDER BY DESK;";
        } else if (time === "last 3 months" && room === "overall") {
            sql =
                "select * from BOOKINGS where date between date_sub(now(),INTERVAL 3 MONTH) and now() AND BOOKINGS.USER IN (SELECT USER FROM hotdesking.GROUPS WHERE" +
                team +
                ")" +
                "ORDER BY DESK;";
        } else if (time === "next week" && room === "overall") {
            sql =
                "select * from BOOKINGS where date between now() and date_add(now(),INTERVAL 1 week) AND BOOKINGS.USER IN (SELECT USER FROM hotdesking.GROUPS WHERE" +
                team +
                ")" +
                "ORDER BY DESK;";
        } else if (time === "last week" && room !== "overall") {
            sql =
                "select * from BOOKINGS WHERE ROOM='" +
                room +
                "' AND date between  date_sub(now(),INTERVAL 1 week) and now() AND BOOKINGS.USER IN (SELECT USER FROM hotdesking.GROUPS WHERE" +
                team +
                ")" +
                "ORDER BY DESK;";
        } else if (time === "last month" && room !== "overall") {
            sql =
                "select * from BOOKINGS WHERE ROOM='" +
                room +
                "' AND date between date_sub(now(),INTERVAL 1 MONTH) and now() AND BOOKINGS.USER IN (SELECT USER FROM hotdesking.GROUPS WHERE" +
                team +
                ")" +
                "ORDER BY DESK;";
        } else if (time === "last 3 months" && room !== "overall") {
            sql =
                "select * from BOOKINGS WHERE ROOM='" +
                room +
                "' AND date between date_sub(now(),INTERVAL 3 MONTH) and now() AND BOOKINGS.USER IN (SELECT USER FROM hotdesking.GROUPS WHERE" +
                team +
                ")" +
                "ORDER BY DESK;";
        } else if (time === "next week" && room !== "overall") {
            sql =
                "select * from BOOKINGS WHERE ROOM='" +
                room +
                "' AND date between now() and date_add(now(),INTERVAL 1 week) AND BOOKINGS.USER IN (SELECT USER FROM hotdesking.GROUPS WHERE" +
                team +
                ")" +
                "ORDER BY DESK;";
        }

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
            'INSERT INTO hotdesking.BOOKINGS VALUES ("' +
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
            'SELECT DESK_NO FROM hotdesking.DESKS where ROOM="' +
            room +
            '" AND NOT DESK_NO IN (SELECT DISTINCT BOOKINGS.DESK FROM DESKS RIGHT JOIN BOOKINGS ON DESKS.ROOM=BOOKINGS.ROOM where BOOKINGS.ROOM="' +
            room +
            '" AND ' +
            times +
            'AND hotdesking.BOOKINGS.DATE="' +
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
        sql = "SELECT email FROM hotdesking.USERS;";
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
        sql = 'SELECT * FROM hotdesking.DESKS WHERE room = "' + room + '";';
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
    sql = "SELECT username FROM hotdesking.USERS WHERE email='" + email + "';";
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
    sql = "SELECT DISTINCT * FROM hotdesking.ROOMS;";
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
        sql = "select USER FROM hotdesking.GROUPS WHERE NAME ='" + team + "';";
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
        sql = "SELECT DISTINCT NAME FROM hotdesking.GROUPS;";
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
        'SELECT DISTINCT USER, DESK FROM hotdesking.BOOKINGS WHERE ROOM="' +
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
        sql =
            'SELECT * FROM hotdesking.BOOKINGS WHERE DATE>"' +
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

function removeUserFromGroup(email, group) {
    sql = "DELETE FROM hotdesking.GROUPS WHERE NAME='" + group + "' AND USER='" + email + "';";
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
    sql = "INSERT INTO hotdesking.GROUPS VALUES ('" + group + "', '" + email + "');";
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
    sql = "DELETE FROM hotdesking.GROUPS WHERE USER='" + email + "';";
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
    sql = "DELETE FROM hotdesking.BOOKINGS WHERE ROOM='" + room + "';";
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
    sql = "DELETE FROM hotdesking.BOOKINGS WHERE DESK=" + desk + " AND ROOM='" + room + "';";
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
    sql = "DELETE FROM hotdesking.BOOKINGS WHERE USER='" + email + "';";
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
        "DELETE FROM hotdesking.BOOKINGS WHERE USER='" +
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
    sql = "DELETE FROM hotdesking.DESKS WHERE ROOM='" + room + "';";
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
    sql = "DELETE FROM hotdesking.ROOMS WHERE NAME='" + room + "';";
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
    sql = "DELETE FROM hotdesking.DESKS WHERE DESK_NO=" + desk + " AND ROOM='" + room + "';";
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
    sql = 'DELETE FROM hotdesking.USERS WHERE email="' + email + '";';
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

function swap(labels, items, leftIndex, rightIndex) {
    var temp = items[leftIndex];
    var temp2 = labels[leftIndex];

    items[leftIndex] = items[rightIndex];
    labels[leftIndex] = labels[rightIndex];

    labels[rightIndex] = temp2;
    items[rightIndex] = temp;
}
function partition(labels, items, left, right) {
    var pivot = items[Math.floor((right + left) / 2)], //middle element
        i = left, //left pointer
        j = right; //right pointer
    while (i <= j) {
        while (items[i] < pivot) {
            i++;
        }
        while (items[j] > pivot) {
            j--;
        }
        if (i <= j) {
            swap(labels, items, i, j); //sawpping two elements
            i++;
            j--;
        }
    }
    return i;
}

function quickSort(labels, items, left, right) {
    var index;
    if (items.length > 1) {
        index = partition(labels, items, left, right); //index returned from partition
        if (left < index - 1) {
            //more elements on the left side of the pivot
            quickSort(labels, items, left, index - 1);
        }
        if (index < right) {
            //more elements on the right side of the pivot
            quickSort(labels, items, index, right);
        }
    }

    return [labels, items];
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
