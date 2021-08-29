const express = require('express');
const router = express.Router();
const services = require('./services');

//  Validates credentials and determines if user is an admin
router.post('/login', (req, res) => {
    console.log('login');
    services
        .login(req.body.email, req.body.password)
        .then((result) => {
            if (result[0]) {
                res.status(200).send({ error: false, admin: result[1], user: result[2], message: 'Success' });
            } else {
                res.status(200).send({
                    error: true,
                    admin: false,
                    user:{},
                    message: 'No email with that password'
                });
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ error: true, admin: false, user: {}, message: err });
        });
});

//  Changes the password of the given user
router.post('/changePassword', (req, res) => {
    services
        .changePassword(req.body.email, req.body.password)
        .then(() => {
            res.status(200).send({ error: false });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ error: true });
        });
});

//  Returns lists of desks, sorted by their rooms
router.get('/getLocationData', (req, res) => {
    console.log('getLocationData');
    services
        .getLocationData()
        .then((result) => {
            res.status(200).send({ error: false, data: result });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ error: true, data: [] });
        });
});

//  Returns the username of the given user
router.post('/getUserName', (req, res) => {
    console.log('getUserName');
    services
        .getUserName(req.body.email)
        .then((result) => {
            res.status(200).send({ error: false, username: result });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ error: true, username: req.body.email });
        });
});

//  Changes the username of the given user
router.post('/setUserName', (req, res) => {
    console.log('setUserName');
    services
        .setUserName(req.body.email, req.body.username)
        .then(() => {
            res.status(200).send({ error: false });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ error: true });
        });
});

//  Returns a list of all of the rooms
router.get('/getRooms', (req, res) => {
    console.log('getRooms');
    services
        .getRooms()
        .then((result) => {
            res.status(200).send({ error: false, rooms: result });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ error: true, rooms: [] });
        });
});

//  Returns a list of all groups
router.get('/getGroups', (req, res) => {
    console.log('getGroups');
    services
        .getGroups()
        .then((result) => {
            res.status(200).send({ error: false, teams: result });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ error: true, teams: [] });
        });
});

//  Returns a list of all users
router.get('/getUsers', (req, res) => {
    console.log('getUsers');
    services
        .getUsers()
        .then((result) => {
            res.status(200).send({ error: false, users: result });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ error: true, users: [] });
        });
});

//  Returns a list of all users in a given group
router.post('/getUsersInGroup', (req, res) => {
    console.log('getUsersInGroup');
    services
        .getUsersInGroup(req.body.team)
        .then((result) => {
            res.status(200).send({ error: false, users: result });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ error: true, users: [] });
        });
});

//  Returns a list of the users bookings
router.post('/getBookings', (req, res) => {
    console.log('getBookings');
    services
        .getBookings(req.body.email)
        .then((result) => {
            res.status(200).send({ error: false, data: result });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ error: true, data: [] });
        });
});

router.get('/getBookings/:email', (req, res) => {
    console.log('getBookings');
    services
        .getBookings(req.params.email)
        .then((result) => {
            console.log('getBookings RESULT:', result);
            res.status(200).send({ error: false, data: result });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ error: true, data: [] });
        });
});
//  Returns a list of bookings on a date
router.get('/getBookingsOnDate/:date', (req, res) => {
    console.log('getBookingsOnDate');
    services
        .getBookingsOnDate(req.params.date)
        .then((result) => {
            res.status(200).send({ bookings: result });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).end();
        });
});

//  Returns a list of bookings at a location
router.get('/getBookingsByLocation/:deskRoom', (req, res) => {
    console.log('getBookingsByLocation');
    services
        .getBookingsByLocation(req.params.deskRoom)
        .then((result) => {
            res.status(200).send({ bookings: result });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).end();
        });
});

//  Returns usage reports
router.post('/getReports', (req, res) => {
    console.log('getReports');
    services
        .getReports(req.body.time, req.body.room, req.body.team, req.body.week)
        .then((result) => {
            res.status(200).send({
                labels: result[0],
                amountOfBookings: result[1],
                desks: result[2],
                deskBookings: result[3],
                activeDays: result[4],
                message: result[5],
                isError: false
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({
                error: true,
                message: err.toString()
            });
        });
});

//  Returns all the bookings in the specified month for a room
router.post('/getBookingsInMonth', (req, res) => {
    console.log('getBookingsInMonth');
    services
        .getBookingsInMonth(req.body.room, req.body.date, req.body.am, req.body.pm)
        .then((result) => {
            res.status(200).send({
                error: false,
                existingBookings: result[1],
                desks: result[0]
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ error: true, existingBookings: [], desks: [] });
        });
});

//  Return active notifications
router.get('/getNotifications', (req, res) => {
    console.log('getNotifications');
    services
        .getNotifications()
        .then((result) => {
            res.status(200).send({ error: false, notifications: result });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ error: true, notifications: [] });
        });
});

//  Adds a user with the given email and password to the database
router.post('/addUser', (req, res) => {
    console.log('addUser');
    services
        .addUser(req.body.email)
        .then(() => {
            res.status(201).end();
        })
        .catch((err) => {
            console.log(err);
            res.status(500).end();
        });
});

//  Adds a desk with a given ID and room
router.post('/addDesk', (req, res) => {
    console.log('addDesk');
    services
        .addDesk(req.body.id, req.body.room)
        .then(() => {
            res.status(200).send({ error: false, message: 'Success' });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ error: true, message: err });
        });
});

//  Adds a booking with a given email, desk, date, AM, and PM (booleans)
router.post('/addBooking', (req, res) => {
    console.log('addBooking');
    console.log('date: ', req.body.date);
    services
        .addBooking(
            req.body.email,
            req.body.deskId,
            req.body.deskRoom,
            new Date(req.body.date[0], req.body.date[1], req.body.date[2]),
            req.body.am,
            req.body.pm
        )
        .then(() => {
            res.status(200).send({ error: false, message: 'Success' });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ error: true, message: err });
        });
});

//  Books all desks in a room on a date for a specific time
router.post('/addRoomRestriction', (req, res) => {
    console.log('addRoomRestriction');
    services
        .addRoomRestriction(
            req.body.email,
            req.body.room,
            req.body.date,
            req.body.am,
            req.body.pm
        )
        .then(() => {
            res.status(201).end();
        })
        .catch((err) => {
            console.log(err);
            res.status(500).end();
        });
});

//  Adds a users to a group
router.post('/addUserToGroup', (req, res) => {
    console.log('addUserToGroup');
    services
        .addUserToGroup(req.body.email, req.body.group)
        .then(() => {
            res.status(200).send({ error: false });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ error: true });
        });
});

//  Adds a notification
router.post('/addNotification', (req, res) => {
    services
        .addNotification(req.body.end, req.body.type, req.body.title, req.body.body)
        .then(() => {
            res.status(200).send({ error: false });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ error: true });
        });
});

//  Removes the specified user
router.post('/removeUser', (req, res) => {
    console.log('removeUser');
    services
        .removeUser(req.body.email)
        .then(() => {
            res.status(200).send({ error: false, message: 'Success' });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ error: true, message: err });
        });
});

//  Removes the specifed desk
router.post('/removeDesk', (req, res) => {
    console.log('removeDesk');
    services
        .removeDesk(req.body.id, req.body.room)
        .then(() => {
            res.status(200).send({ error: false, message: 'Success' });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ error: true, message: err });
        });
});

//  Removes all desks in the specified room
router.post('/removeRoom', (req, res) => {
    console.log('removeRoom');
    services
        .removeRoom(req.body.room)
        .then(() => {
            res.status(200).send({ error: false, message: 'Success' });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ error: true, message: err });
        });
});

//  Removes the specified booking
router.post('/removeBooking', (req, res) => {
    console.log('removeBooking');
    services
        .removeBooking(
            req.body.userEmail,
            req.body.deskId,
            req.body.deskRoom,
            req.body.date,
            req.body.am,
            req.body.pm
        )
        .then(() => {
            res.status(200).send({ error: false, message: 'Success' });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ error: true, message: err });
        });
});

//  Removes the user from the group
router.post('/removeUserFromGroup', (req, res) => {
    console.log('removeUserFromGroup');
    services
        .removeUserFromGroup(req.body.email, req.body.group)
        .then((result) => {
            res.status(200).send({ error: false });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ error: true });
        });
});

//  Returns a list of meeting rooms
router.get('/meetingRooms', (req, res) => {
    console.log('getMeetingRooms');
    services
        .getMeetingRooms()
        .then((rooms) => {
            res.status(200).send({ data: rooms });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).end();
        });
});

//  Adds a meeting room
router.put('/meetingRooms/:name', (req, res) => {
    console.log('addMeetingRoom');
    services
        .addMeetingRoom(req.params.name)
        .then(() => {
            res.status(201).end();
        })
        .catch((err) => {
            console.log(err);
            res.status(500).end();
        });
});

router.delete('/meetingRooms/:name', (req, res) => {
    console.log('removeMeetingRoom');
    services
        .removeMeetingRoom(req.params.name)
        .then(() => res.status(204).end())
        .catch((err) => {
            console.log(err);
            res.status(500).end();
        });
});

router.get('/getAppointments/:room/:date', (req, res) => {
    console.log('getAppointments');
    services
        .getAppointments(req.params.room, req.params.date)
        .then((appointments) => res.status(200).send({ appointments: appointments }))
        .catch((err) => {
            console.log(err);
            res.status(500).end();
        });
});

router.get('/getAppointments/:email', (req, res) => {
    console.log('getAppointments');
    services
        .getAppointmentsByEmail(req.params.email)
        .then((appointments) => res.status(200).send({ appointments: appointments }))
        .catch((err) => {
            console.log(err);
            res.status(500).end();
        });
});

router.put('/appointments', (req, res) => {
    console.log('addAppointment');
    services
        .addAppointment(
            req.body.email,
            req.body.title,
            req.body.start,
            req.body.end,
            req.body.room
        )
        .then(() => res.status(201).end())
        .catch((err) => {
            console.log(err);
            res.status(500).end();
        });
});

router.delete('/appointments/:id', (req, res) => {
    console.log('removeAppointment');
    services
        .removeAppointment(req.params.id)
        .then(() => res.status(204).end())
        .catch((err) => {
            console.log(err);
            res.status(500).end();
        });
});

router.get('/getUserBookingCount/:email', (req, res) => {
    console.log('getUserBookingCount');
    services
        .getUserBookingCount(req.params.email)
        .then((count) => {
            res.status(200).send({ error: false, count: count });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ error: true, count: -1 });
        });
});
router.get('/getUserAppointmentCount/:email', (req, res) => {
    console.log('getUserAppointmentCount');
    services
        .getUserAppointmentCount(req.params.email)
        .then((count) => {
            res.status(200).send({ error: false, count: count });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ error: true, count: -1 });
        });
});

router.get('/adminOptions', (req, res) => {
    console.log('getAdminOptions');
    services
        .getAdminOptions()
        .then((options) => res.status(200).send({ options: options }))
        .catch((err) => {
            console.log(err);
            res.status(500).end();
        });
});

router.patch('/adminOptions/:key', (req, res) => {
    console.log('updateAdminOptions');
    services
        .updateAdminOptions(req.params.key, req.body.value)
        .then(res.status(204).end())
        .catch((err) => {
            console.log(err);
            res.status(500).send({ error: true, message: err });
        });
});

router.get('/adminOptions/:key', (req, res) => {
    services
        .getAdminOption(req.params.key)
        .then((option) => res.status(200).send({ option: option }))
        .catch((err) => {
            console.log(err);
            res.status(500).send({ error: true, message: err });
        });
});
router.get('/allBookings/:date', (req, res) => {
    services
        .getAllBookingsOnDate(req.params.date)
        .then((returnValue) => res.status(200).send(returnValue))
        .catch((err) => {
            console.log(err);
            res.status(500).send({ error: true, message: err });
        });
});

router.get('/token/:email/:username/:admin', (req, res) => {
    services.getToken(email, username, admin)
    .then((token) => {
        res.status(200).send({token: token});
    })
    .catch((err) => {
        console.log(err);
        res.status(500).end();
    });
});

router.get('/verify:email/:username/:admin', (req, res) => {
    services.verify(email, username, admin)
    .then((verified) => {
        res.status(200).send({verified: verified});
    })
    .catch((err) => {
        console.log(err);
        res.status(500).end();
    });
});


module.exports = router;
