const express = require('express');
const router = express.Router();
const services = require('./services');

//  Validates credentials and determines if user is an admin
router.post('/login', (req, res) => {
    console.log('login');
    services.login(req.body.email, req.body.password)
    .then((result) => {
        if (result[0]) {
            res.status(200).send({error: false, admin: result[1], message: 'Success'});
        } else {
            res.status(200).send({error: true, admin: false, message: 'No email with that password'});
        }
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: true, admin: false, message: err});
    });
});

//  Changes the password of the given user
router.post('/changePassword', (req, res) => {
    services.changePassword(req.body.email, req.body.password)
    .then(() => {
        res.status(200).send({error: false});
    })
    .catch((err) => {
        res.status(500).send({error: true});
    });
});

//  Checks if the given user is an admin
router.post('/adminCheck', (req, res) => {
    console.log('adminCheck');
    services.adminCheck(email)
    .then((result) => {
        res.status(200).send({error: false, admin: result});
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: true, admin: false});
    });
});

//  Returns lists of desks, sorted by their rooms
router.get('/getLocationData', (req, res) => {
    console.log('getLocationData');
    services.getLocationData()
    .then((result) => {
        res.status(200).send({error: false, data: result});
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: true, data: []});
    });
});

//  Returns the username of the given user
router.post('/getUserName', (req, res) => {
    console.log('getUserName');
    services.getUserName(req.body.email)
    .then((result) => {
        res.status(200).send({error: false, username: result})
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: true, username: req.body.email});
    });
});

//  Changes the username of the given user
router.post('/setUserName', (req, res) => {
    console.log('setUserName');
    services.setUserName(req.body.email, req.body.username)
    .then(() => {
        res.status(200).send({error: false});
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: true});
    });
});

//  Returns a list of all of the rooms
router.get('/getRooms', (req, res) => {
    console.log('getRooms');
    services.getRooms()
    .then((result) => {
        res.status(200).send({error: false, rooms: result});
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: true, rooms: []});
    });
});

//  Returns a list of all groups
router.get('/getGroups', (req, res) => {
    console.log('getGroups');
    services.getGroups()
    .then((result) => {
        res.status(200).send({error: false, teams: result});
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: true, teams: []});
    });
});

//  Returns a list of all users
router.get('/getUsers', (req, res) => {
    console.log('getUsers');
    services.getUsers()
    .then((result) => {
        res.status(200).send({error: false, users: result});
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: true, users: []});
    });
})

//  Returns a list of all users in a given group
router.post('/getUsersInGroup', (req, res) => {
    console.log('getUsersInGroup');
    services.getUsersInGroup(req.body.team)
    .then((result) => {
        res.status(200).send({error: false, users: result});
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: true, users: []});
    });
});

//  Returns a list of the users bookings
router.post('/getBookings', (req, res) => {
    console.log('getBookings');
     services.getBookings(req.body.email)
     .then((result) => {
         res.status(200).send({error: false, data: result});
     })
     .catch((err) => {
         console.log(err);
         res.status(500).send({error: true, data: []});
     });
});

//  Returns usage reports       TODO
router.get('/getReports', (req, res) => {
    console.log('getReports');
    services.getReports()
    .then((result) => {

    })
    .catch((err) => {
        console.log(err);
        res.status(500).send({})
    });
});

//  Returns all the bookings in the specified month for a room       TODO
router.post('/getBookingsInMonth', (req, res) => {
    console.log('getBookingsInMonth');
    services.getBookingsInMonth(req.body.room, req.body.date, req.body.am, req.body.pm)
    .then((result) => {
        res.status(200),send({error: false, existingBookings: result[1], desks: result[0]});
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: true, existingBookings: [], desks: []});
    });
});

//  Return active notifications
router.get('/getNotifications', (req, res) => {
    console.log('getNotifications');
    services.getNotifications()
    .then((result) =>  {
        res.status(200).send({error: false, notifications: result});
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: true, notifications: []});
    });
});

//  Adds a user with the given email and password to the database
router.post('/addUser', (req, res) => {
    console.log('addUser');
    services.addUser(req.body.email, req.body.password)
    .then(() => {
        res.status(200).send({error: false, message: "Success"});
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: true, message: err});
    });
});

//  Adds a desk with a given ID and room 
router.post('/addDesk', (req, res) => {
    console.log('addDesk');
    services.addDesk(req.body.id, req.body.room)
    .then(() => {
        res.status(200).send({error: false, message: "Success"});
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: true, message: err});
    });
});

//  Adds a booking with a given email, desk, date, AM, and PM (booleans)
router.post('/addBooking', (req, res) => {
    console.log('addBooking');
    services.addBooking(req.body.email, req.body.deskId, req.body.deskRoom, req.body.date, req.body.am, req.body.pm)
    .then(() => {
        res.status(200).send({error: false, message: "Success"});
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: true, message: err});
    });
});

//  Adds a users to a group
router.post('/addUserToGroup', (req, res) => {
    console.log('addUserToGroup');
    services.addUserToGroup(req.body.email, req.body.group)
    .then(() => {
        res.status(200).send({error: false});
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: true});
    });
});

//  Adds a notification
router.post('/addNotification', (req, res) => {
    services.addNotification(req.body.date, req.body.type, req.body.title, req.body.body)
    .then(() => {
        res.status(200).send({error: false});
    })
    .catch((err) => {
        res.status(500).send({error: true});
    });
});    


//  Removes the specified user
router.post('/removeUser', (req, res) => {
    console.log('removeUser');
    services.removeUser(req.body.email)
    .then(() => {
        res.status(200).send({error: false, message: "Success"});
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: true, message: err});
    });
});

//  Removes the specifed desk 
router.post('/removeDesk', (req, res) => {
    console.log('removeDesk');
    services.removeDesk(req.body.id, req.body.room)
    .then(() => {
        res.status(200).send({error: false, message: "Success"});
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: true, message: err});
    });
});

//  Removes all desks in the specified room
router.post('/removeRoom', (req, res) => {
    console.log('removeRoom');
    services.removeRoom(req.body.room)
    .then(() => {
        res.status(200).send({error: false, message: "Success"});
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: true, message: err});
    });
});

//  Removes the specified booking 
router.post('/removeBooking', (req, res) => {
    console.log('removeBooking');
    services.removeBooking(req.body.email, req.body.deskId, req.body.deskRoom, req.body.date, req.body.am, req.body.pm)
    .then(() => {
        res.status(200).send({error: false, message: "Success"});
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: true, message: err});
    });
});

//  Removes the user from the group
router.post('/removeUserFromGroup', (req, res) => {
    console.log('removeUserFromGroup');
    services.removeUserFromGroup(req.body.email, req.body.group)
    .then((result) => {
        res.status(200).send({error: false});
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send({error: true});
    });
});

module.exports = router