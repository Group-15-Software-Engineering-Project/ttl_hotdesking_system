const {
    sequelize,
    User,
    Desk,
    Booking,
    Group,
    Notification,
    Appointment,
    Room,
    AdminOption
} = require('../sequelize');
const { QueryTypes, Op } = require('sequelize');
const sha256 = require('js-sha256');
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
});

module.exports = {
    login: async (email, password) => {
        const model = await User.findAll({
            where: {
                email: email,
                password: sha256(password)
            }
        });
        const groupModel = await Group.findAll({
            where: {
                userEmail: email,
                name: 'admin'
            }
        });
        const admin = groupModel.length > 0;
        let a = email;
        let b = model[0].username;
        let date = new Date();
        let c = date.getFullYear() + date.getMonth() + date.getDate() + date.getDay();
        let token = sha256(a + c + process.env.REACT_APP_SECRET + (admin ? process.env.REACT_APP_ADMIN_SECRET : "") + b);
        
        return model.length > 0 ? [true, admin, {email: a, username: b, token: token}] : [false, false, {}];
    },
    adminCheck: async (email) => {
        const model = await Group.findAll({
            where: {
                userEmail: email,
                name: 'admin'
            }
        });
        return model.length > 0;
    },
    getLocationData: async () => {
        const data = [];
        const rooms = await module.exports.getRoomsList();
        for (const room in rooms) {
            const deskModels = await Desk.findAll({
                where: {
                    room: rooms[room]
                }
            });
            const desks = [];
            for (const desk of deskModels) {
                desks.push(desk.getDataValue('id'));
            }
            data[room] = { name: rooms[room], desks: desks };
        }
        return data;
    },
    getRoomsList: async () => {
        const rooms = [];
        const distinctRooms = await sequelize.query(
            'SELECT DISTINCT room FROM hotdesking.desks;',
            {
                type: QueryTypes.SELECT
            }
        );
        for (const room in distinctRooms) {
            rooms.push(distinctRooms[room].room);
        }
        return rooms;
    },
    getUserName: async (email) => {
        const model = await User.findByPk(email);
        const username = model.getDataValue('username');
        return username || email;
    },
    setUserName: async (email, username) => {
        const model = await User.findByPk(email);
        model.username = username;
        model.save();
    },
    changePassword: async (email, password) => {
        const model = await User.findByPk(email);
        model.password = sha256(password);
        model.save();
    },
    getRooms: async () => {
        const rooms = [];
        const distinctRooms = await sequelize.query(
            'SELECT DISTINCT room FROM hotdesking.desks;', {
                type: QueryTypes.SELECT
            }
        );
        for (const room in distinctRooms) {
            rooms.push({
                value: distinctRooms[room].room,
                label: ''
            });
        }
        return rooms;
    },
    getDesks: async (room) => {
        const desks = [];
        const models = await Desk.findAll({
            where: {
                room: room
            }
        });
        for (const model in models) {
            desks.push(models[model].getDataValue('id'));
        }
        return desks;
    },
    getGroups: async () => {
        const groups = [];
        const distinctNames = await sequelize.query(
            'SELECT DISTINCT name FROM hotdesking.groups;',
            {
                type: QueryTypes.SELECT
            }
        );
        for (const group in distinctNames) {
            groups.push(distinctNames[group].name);
        }
        groups.unshift(groups.splice(groups.indexOf('All Users'), 1));
        return groups;
    },
    getUsers: async () => {
        const users = [];
        const models = await User.findAll({
            attributes: ['email']
        });
        for (const model in models) {
            users.push(models[model].getDataValue('email'));
        }
        return users;
    },
    getUsersInGroup: async (group) => {
        const users = [];
        const models = await Group.findAll({
            where: {
                name: group
            },
            attributes: ['userEmail']
        });
        for (const model in models) {
            users.push(models[model].getDataValue('userEmail'));
        }
        return users;
    },
    getBookings: async (email) => {
        let models = await Booking.findAll({
            raw: true,
            where: {
                userEmail: email
            },
            order: [['date', 'ASC']]
        });

        const todayDate = new Date();
        const today = models.filter(
            (booking) =>
                new Date(booking.date).getFullYear() === todayDate.getFullYear() &&
                new Date(booking.date).getMonth() === todayDate.getMonth() &&
                new Date(booking.date).getDate() === todayDate.getDate()
        );
        models = models.filter((booking) => !today.includes(booking));
        const past = models.filter(
            (booking) =>
                new Date(booking.date).getFullYear() <= todayDate.getFullYear() &&
                new Date(booking.date).getMonth() <= todayDate.getMonth() &&
                new Date(booking.date).getDate() < todayDate.getDate()
        );
        models = models.filter((booking) => !past.includes(booking));

        models.unshift(...today);
        models.push(...past);
        return models;
    },
    getBookingsOnDate: async (date) => {
        const bookings = await Booking.findAll({
            raw: true,
            where: {
                date: date
            },
            order: [
                ['deskRoom', 'ASC'],
                ['deskId', 'ASC']
            ]
        });
        return bookings;
    },
    getBookingsByLocation: async (deskRoom) => {
        const bookings = await Booking.findAll({
            raw: true,
            where: {
                deskRoom: deskRoom
            },
            order: [['deskId', 'ASC']]
        });
        return bookings;
    },
    getBookingsWithOptions: async (options) => {
        const bookings = await Booking.findAll(options);
        return [bookings.length, bookings];
    },
    getBookingsByDesks: async (deskOptions, bookingOptions) => {
        const report = [[], []];
        const desks = await Desk.findAll(deskOptions);
        for (const desk in desks) {
          bookingOptions.where.deskId = desks[desk].getDataValue('id');
          bookingOptions.where.deskRoom = desks[desk].getDataValue('room');
          const deskBookingsCount = await Booking.count(bookingOptions);
          report[0].push(`${desks[desk].getDataValue('room')} Desk ${desks[desk].getDataValue('id')}`);
          report[1].push(deskBookingsCount);
        }
        return report;
    },
    getReports: async (time, room, team, week) => {
        const userBookingsCount = [];
        let allBookings = [];
        const bookingDistribution = [0, 0, 0, 0, 0, 0, 0];
        const users = await module.exports.getUsersInGroup(team);
        const days = week * 7;
        const options = {
            where: {}
        };
        const deskOptions = {
            where: {}
        };
        const bookingOptions = {
            where: {
                userEmail: {
                    [Op.in] : users
                }
            }
        };
        if (room !== 'overall') {
            options.where.deskRoom = room;
            deskOptions.where.room = room;
        }
        const today = new Date();

        switch (time) {
        case 'next week':
            bookingOptions.where.date = options.where.date = {
                [Op.gte]: today,
                [Op.lt]: new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    today.getDate() + 7
                )
            };
            break;
        case 'last week':
            bookingOptions.where.date = options.where.date = {
                [Op.gte]: new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    today.getDate() - 7
                ),
                [Op.lt]: today
            };
            break;
        case 'last month':
            bookingOptions.where.date = options.where.date = {
                [Op.gte]: new Date(
                    today.getFullYear(),
                    today.getMonth() - 1,
                    today.getDate()
                ),
                [Op.lt]: today
            };
            break;
        case 'last 3 months':
            bookingOptions.where.date = options.where.date = {
                [Op.gte]: new Date(
                    today.getFullYear(),
                    today.getMonth() - 3,
                    today.getDate()
                ),
                [Op.lt]: today
            };
            break;
        case 'upcomingweek':
            bookingOptions.where.date = options.where.date = {
                [Op.lt]: new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    today.getDate() + days
                ),
                [Op.gte]: today
            };
            break;
        case 'default':
            break;
        }
        for (const user in users) {
            options.where.userEmail = users[user];
            const userBookings = await module.exports.getBookingsWithOptions(options);
            userBookingsCount[user] = userBookings[0];
            allBookings = allBookings.concat(userBookings[1]);
        }
        for (const booking in allBookings) {
            bookingDistribution[
                new Date(allBookings[booking].getDataValue('date')).getDay()
            ]++;
        }
        const deskReports = await module.exports.getBookingsByDesks(deskOptions, bookingOptions);
        return [users, userBookingsCount, deskReports[0], deskReports[1], bookingDistribution, 'Success'];
        //  Empty values are for deprecated desk report piechart
    },
    getBookingsInMonth: async (room, date, am, pm) => {
        const dateComp = date.split('-');
        const desks = [];
        const existingBookings = [];
        const daysInMonth = new Date(
            parseInt(dateComp[0]),
            parseInt(dateComp[1]) - 1,
            0
        ).getDate();

        const deskModel = await Desk.findAll({
            where: {
                room: room
            }
        });
        for (const desk of deskModel) {
            desks.push(desk.getDataValue('id'));
        }
        for (let day = 0; day <= daysInMonth; day++) {
            existingBookings[day] = [];
            let whereClause;
            // If full day requested, check for either am or pm being booked.
            if (am && pm) {
                whereClause = {
                    deskRoom: room,
                    date: new Date(parseInt(dateComp[0]), parseInt(dateComp[1]) - 1, day + 1),
                    [Op.or]: [{ am: true }, { pm: true }]
                };
            } else {
                // Else if am or pm requested, add them accordingly, with the other being absent since we don't care.
                whereClause = {
                    deskRoom: room,
                    date: new Date(parseInt(dateComp[0]), parseInt(dateComp[1]) - 1, day + 1)
                };
                if (am) whereClause.am = true;
                if (pm) whereClause.pm = true;
            }
            const bookings = await Booking.findAll({
                where: whereClause
            });
            for (const booking in bookings) {
                existingBookings[day].push({
                    user: bookings[booking].getDataValue('userEmail'),
                    desk: bookings[booking].getDataValue('deskId')
                });
            }
        }
        return [desks, existingBookings];
    },
    getNotifications: async () => {
        const notifications = [];
        const models = await Notification.findAll({
            raw: true,
            where: {
                end: {
                    [Op.gt]: new Date()
                }
            }
        });

        Notification.destroy({
            raw: true,
            where: {
                end: {
                    [Op.lt]: new Date()
                }
            }
        });

        for (const model of models) {
            notifications.push({
                type: model.type,
                date: model.start,
                body: model.body,
                title: model.title
            });
        }
        return notifications;
    },
    getMeetingRooms: async () => {
        const rooms = [];
        const models = await Room.findAll();
        models.forEach((value) => {
            rooms.push({ value: value.getDataValue('name') });
        });
        return rooms;
    },
    getAppointments: async (room, date) => {
        const appointments = await Appointment.findAll({
            raw: true,
            where: {
                roomName: room,
                start: {
                    [Op.gte]: date
                }
            }
        });
        return appointments;
    },
    addUser: async (email) => {
        const password = email;
        const options = {
            from: process.env.EMAIL,
            to: email,
            subject: 'ttl_hotdesking Account',
            text: `Email: ${email}\nPassword: ${password}`
        };
        transporter.sendMail(options);
        await User.create({ email: email, password: sha256(password) });
        await Group.create({ userEmail: email, name: 'All Users' });
    },
    addDesk: async (id, room) => {
        const arr = [];
        for (const desk of id) {
            arr.push({ id: desk, room: room });
        }
        console.log(id, arr);
        await Desk.bulkCreate(arr);
    },
    addBooking: async (email, id, room, date, am, pm) => {
        const options = {
            from: process.env.EMAIL,
            to: email,
            subject: 'ttl_hotdesking Booking Confirmation',
            text: `Your booking for ${room} desk ${id} on ${date} has been confirmed`
        };
        await Booking.create({
            userEmail: email,
            deskId: id,
            deskRoom: room,
            date: date,
            am: am,
            pm: pm
        });
        transporter.sendMail(options);
    },
    addRoomRestriction: async (email, room, date, am, pm) => {
        const bookings = [];
        const desks = await module.exports.getDesks(room);
        for (const desk in desks) {
            bookings.push({
                userEmail: email,
                deskId: desks[desk],
                deskRoom: room,
                date: date,
                am: am,
                pm: pm
            });
        }
        await Booking.bulkCreate(bookings);
    },
    addUserToGroup: async (email, group) => {
        await Group.create({ name: group, userEmail: email });
    },
    addNotification: async (end, type, title, body) => {
        await Notification.create({
            start: new Date(),
            end: end,
            type: type,
            title: title,
            body: body
        });
    },
    addMeetingRoom: async (name) => {
        await Room.create({
            name: name
        });
    },
    addAppointment: async (email, title, start, end, room) => {
        await Appointment.create({
            bookedBy: email,
            title: title,
            start: start,
            end: end,
            roomName: room
        });
    },
    getAdminOptions: async () => {
        const options = await AdminOption.findAll({
            raw: true
        });
        console.log('OPTIONS', options);
        return options;
    },
    getAdminOption: async (key) => {
        const option = await AdminOption.findOne({
            raw: true,
            where: {
                key: key
            }
        });
        return option;
    },
    updateAdminOptions: async (key, value) => {
        const model = await AdminOption.findByPk(key);
        model.value = value;
        model.save();
    },
    removeUser: async (email) => {
        const model = await User.findByPk(email);
        model.destroy();
    },
    removeDesk: async (id, room) => {
        const model = await Desk.findOne({
            where: {
                id: id,
                room: room
            }
        });
        model.destroy();
    },
    removeRoom: async (room) => {
        const models = await Desk.findAll({
            where: {
                room: room
            }
        });
        for (const model in models) {
            models[model].destroy();
        }
    },
    removeBooking: async (email, id, room, date, am, pm) => {
        console.log(email, id, room, date, am, pm);
        const model = await Booking.findOne({
            where: {
                userEmail: email,
                deskId: id,
                deskRoom: room,
                date: date,
                am: am,
                pm: pm
            }
        });
        model.destroy();
    },
    removeUserFromGroup: async (email, group) => {
        const model = await Group.findOne({
            where: {
                name: group,
                userEmail: email
            }
        });
        model.destroy();
    },
    removeMeetingRoom: async (name) => {
        const model = await Room.findByPk(name);
        model.destroy();
    },
    removeAppointment: async (id) => {
        const model = await Appointment.findByPk(id);
        model.destroy();
    },
    getAppointmentsByEmail: async (email) => {
        let appointments = await Appointment.findAll({
            where: {
                bookedBy: email
            },
            order: [['start', 'ASC']]
        });
        const today = appointments.filter(
            (appointment) =>
                new Date(appointment.start).getFullYear() === new Date().getFullYear() &&
                new Date(appointment.start).getMonth() === new Date().getMonth() &&
                new Date(appointment.start).getDate() === new Date().getDate()
        );
        appointments = appointments.filter((appointment) => !today.includes(appointment));
        const past = appointments.filter(
            (booking) =>
                new Date(booking.start).getFullYear() <= new Date().getFullYear() &&
                new Date(booking.start).getMonth() <= new Date().getMonth() &&
                new Date(booking.start).getDate() < new Date().getDate()
        );
        appointments = appointments.filter((booking) => !past.includes(booking));
        appointments.unshift(...today);
        appointments.push(...past);
        return appointments;
    },
    getUserBookingCount: async (email) => {
        const count = await Booking.count({
            where: {
                userEmail: email
            }
        });
        return count;
    },
    getUserAppointmentCount: async (email) => {
        const count = await Appointment.count({
            where: {
                bookedBy: email
            }
        });
        return count;
    },
    getAllBookingsOnDate: async (date) => {
        let deskBookings = [];
        let appointments = [];
        const deskRooms = await Desk.aggregate('room', 'DISTINCT', { plain: false });
        for (let i = 0; i < deskRooms.length; i++) {
            deskRooms[i] = deskRooms[i].DISTINCT;
        }
        for (const room of deskRooms) {
            const bookings = await Booking.findAll({
                raw: true,
                where: {
                    deskRoom: room,
                    date: date
                },
                order: [
                    ['deskId', 'ASC'],
                    ['am', 'DESC']
                ]
            });
            deskBookings.push({
                location: room,
                bookings: bookings
            });
        }

        const meetingRooms = await Room.findAll({ raw: true });
        for (let i = 0; i < meetingRooms.length; i++) {
            meetingRooms[i] = meetingRooms[i].name;
        }

        for (const room of meetingRooms) {
            const bookings = await Appointment.findAll({
                raw: true,
                where: {
                    roomName: room,
                    start: {
                        [Op.and]: {
                            [Op.gte]: new Date(
                                new Date(date).getFullYear(),
                                new Date(date).getMonth(),
                                new Date(date).getDate(),
                                0,
                                0
                            ),
                            [Op.lt]: new Date(
                                new Date(date).getFullYear(),
                                new Date(date).getMonth(),
                                new Date(date).getDate() + 1,
                                0,
                                0
                            )
                        }
                    }
                },
                order: [['start', 'ASC']]
            });
            appointments.push({
                location: room,
                bookings: bookings
            });
        }
        deskBookings = deskBookings.filter((obj) => obj.bookings.length !== 0);
        appointments = appointments.filter((obj) => obj.bookings.length !== 0);
        return { bookings: deskBookings, appointments: appointments };
    },
};
