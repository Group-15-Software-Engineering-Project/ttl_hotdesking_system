const { sequelize, User, Desk, Booking, Group, Notification } = require("../sequelize");
const { QueryTypes, Op } = require("sequelize");
const user = require("../models/user");
const { now } = require("sequelize/types/lib/utils");

module.exports = {
    login: async (email, password) => {
        let model = await User.findAll({
            where: {
                email: email,
                password: password,
            },
        });
        let groupModel = await Group.findAll({
            where: {
                userEmail: email,
                name: "admin",
            },
        });
        let admin = groupModel.length > 0 ? true : false;
        return model.length > 0 ? [true, admin] : [false, false];
    },
    adminCheck: async (email) => {
        let model = await Group.findAll({
            where: {
                userEmail: email,
                name: "admin",
            },
        });
        return model.length > 0 ? true : false;
    },
    getLocationData: async () => {
        let data = [];
        let rooms = await module.exports.getRoomsList();
        console.log(rooms);
        for  (let room in rooms) {
            let deskModels = await Desk.findAll({
                where: {
                    room: rooms[room],
                },
            });
            let desks = [];
            for (desk of deskModels) {
                desks.push(desk.getDataValue("id"));
            }
            data[room] = { name: rooms[room], desks: desks };
        }
        return data;
    },
    getRoomsList: async () => {
        let rooms = [];
        let distinctRooms = await sequelize.query('SELECT DISTINCT room FROM desks;', {
            type: QueryTypes.SELECT
        });
        for (let room in distinctRooms) {
            rooms.push(distinctRooms[room].room);
        }
        return rooms;
    },
    getUserName: async (email) => {
        let model = await User.findByPk(email);
        let username = model.getDataValue("username");
        return username ? username : email;
    },
    setUserName: async (email, username) => {
        let model = await User.findByPk(email);
        model.username = username;
        model.save();
    },
    changePassword: async (email, password) => {
        let model = await User.findByPk(email);
        model.password = password;
        model.save();
    },
    getRooms: async () => {
        let rooms = [];
        let distinctRooms = await sequelize.query("SELECT DISTINCT room FROM desks;", {
            type: QueryTypes.SELECT,
        });
        for (let room in distinctRooms) {
            rooms.push({
                value: distinctRooms[room].room,
                label: "",
            });
        }
        return rooms;
    },
    getGroups: async () => {
        let groups = [];
        let distinctNames = await sequelize.query("SELECT DISTINCT name FROM groups;", {
            type: QueryTypes.SELECT,
        });
        for (let group in distinctNames) {
            groups.push(distinctNames[group].name);
        }
        return groups;
    },
    getUsers: async () => {
        let users = [];
        let models = await User.findAll({
            attributes: ["email"],
        });
        for (let model in models) {
            users.push(models[model].getDataValue("email"));
        }
        return users;
    },
    getUsersInGroup: async (group) => {
        let users = [];
        let models = await Group.findAll({
            where: {
                name: group,
            },
            attributes: ["userEmail"],
        });
        for (let model in models) {
            users.push(models[model].getDataValue("userEmail"));
        }
        return users;
    },
    getBookings: async (email) => {
        let bookings = [];
        let models = await Booking.findAll({
            raw: true,
            where: {
                userEmail: email,
            },
        });
        for (let model in models) {
            bookings.push(models[model]);
        }
        console.log(bookings);
        return bookings;
    },
    getReports: (time, room, team) => {

    },
    getBookingsInMonth: async (room, date, am, pm) => {
        console.log("SERVICE:", typeof date);
        let deskModel = await Desk.findAll({
            where: {
                room: room,
            },
        });
        let desks = [];
        for (let desk of deskModel) {
            console.log("SERVICE DESK:", desk);
            desks.push(desk.getDataValue("id"));
        }
        let dateComp = date.split("-");
        let bookings = await Booking.findAll({
            raw: true,
            where: {
                deskRoom: room,
                am: am,
                pm: pm,
                [Op.and]: [
                    {
                        date: {
                            [Op.gt]: new Date(
                                parseInt(dateComp[0]),
                                parseInt(dateComp[1]) - 1,
                                1
                            ),
                        },
                    },
                    {
                        date: {
                            [Op.lt]: new Date(parseInt(dateComp[0]), parseInt(dateComp[1]), 1),
                        },
                    },
                ],
            },
        });
        console.log("DESKS:", desks, "BOOKINGS:", bookings);
        return [desks, bookings];
    },
    getNotifications: async () => {
        let notifications = [];
        let models = await Notification.findAll({
            raw: true,
            where: {
                end: {
                    [Op.gt]: new Date(),
                },
            },
        });
        for (let model in models) {
            notifications.push(models[model]);
        }
        console.log(notifications);
        return notifications;
    },
    addUser: async (email, password) => {
        await User.create({ email: email, password: password });
        await Group.create({ userEmail: email, name: "All Users" });
    },
    addDesk: async (id, room) => {
        await Desk.create({ id: id, room: room });
    },
    addBooking: async (email, id, room, date, am, pm) => {
        await Booking.create({
            userEmail: email,
            deskId: id,
            deskRoom: room,
            date: date,
            am: am,
            pm: pm,
        });
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
            body: body,
        });
    },
    removeUser: async (email) => {
        let model = await User.findByPk(email);
        model.destroy();
    },
    removeDesk: async (id, room) => {
        let model = await Desk.findOne({
            where: {
                id: id,
                room: room,
            },
        });
        model.destroy();
    },
    removeRoom: async (room) => {
        let models = await Desk.findAll({
            where: {
                room: room,
            },
        });
        for (let model in models) {
            models[model].destroy();
        }
    },
    removeBooking: async (email, id, room, date, am, pm) => {
        let model = await Booking.findOne({
            where: {
                userEmail: email,
                deskId: id,
                deskRoom: room,
                date: date,
                am: am,
                pm: pm,
            },
        });
        model.destroy();
    },
    removeUserFromGroup: async (email, group) => {
        let model = await Group.findOne({
            where: {
                name: group,
                userEmail: email,
            },
        });
        model.destroy();
    },
    getReportsByUser: async (time, room, team) => {
        let bookings = [];
        if (time === "overall" && room === "overall") {
            let users = this.getUsersInGroup(team);
            for (let user in users) {
                let bookingsByUser = this.getBookings(user);
                for (let booking in bookingsByUser) {
                    bookings.push(booking);
                }
            }
            return bookings;
        } else if (time === "overall" && room !== "overall") {
            let users = this.getUsersInGroup(team);
            for (email in users) {
                let models = await Booking.findAll({
                    where: {
                        userEmail: email,
                        deskRoom: room,
                    },
                });
                for (let model in models) {
                    bookings.push(models[model]);
                }
            }
            return bookings;
        } else if (time === "last week" && room === "overall") {
            let users = this.getUsersInGroup(team);
            for (let user in users) {
                let bookingsByUser = this.getBookings(user);
                for (let booking in bookingsByUser) {
                    if (now() - booking.getDataValue("date") <= 7 && now() - booking.getDataValue("date") > 0) {
                        bookings.push(booking);
                    }
                }
            }
            return bookings;
        } else if (time === "last month" && room === "overall") {
            let users = this.getUsersInGroup(team);
            for (let user in users) {
                let bookingsByUser = this.getBookings(user);
                for (let booking in bookingsByUser) {
                    if (now() - booking.getDataValue("date") <= 30 && now() - booking.getDataValue("date") > 0) {
                        bookings.push(booking);
                    }
                }
            }
        } else if (time === "last 3 months" && room === "overall") {
            let users = this.getUsersInGroup(team);
            for (let user in users) {
                let bookingsByUser = this.getBookings(user);
                for (let booking in bookingsByUser) {
                    if (now() - booking.getDataValue("date") <= 90 && now() - booking.getDataValue("date") > 0) {
                        bookings.push(booking);
                    }
                }
            }
        } else if (time === "next week" && room === "overall") {
            let users = this.getUsersInGroup(team);
            for (let user in users) {
                let bookingsByUser = this.getBookings(user);
                for (let booking in bookingsByUser) {
                    if (booking.getDataValue("date") - now() <= 7 && booking.getDataValue("date") - now() > 0) {
                        bookings.push(booking);
                    }
                }
            }
        } else if (time === "last week" && room !== "overall") {
            let users = this.getUsersInGroup(team);
            let bookingsByUserAndRoom = [];
            for (email in users) {
                let models = await Booking.findAll({
                    where: {
                        userEmail: email,
                        deskRoom: room,
                    },
                });
                for (let model in models) {
                    bookingsByUserAndRoom.push(models[model]);
                }
            }
            for (let booking in bookingsByUserAndRoom) {
                if (now() - booking.getDataValue("date") <= 7 && now() - booking.getDataValue("date") > 0) {
                    bookings.push(booking);
                }
            }
            return bookings;
        } else if (time === "last month" && room !== "overall") {
            let users = this.getUsersInGroup(team);
            let bookingsByUserAndRoom = [];
            for (email in users) {
                let models = await Booking.findAll({
                    where: {
                        userEmail: email,
                        deskRoom: room,
                    },
                });
                for (let model in models) {
                    bookingsByUserAndRoom.push(models[model]);
                }
            }
            for (let booking in bookingsByUserAndRoom) {
                if (now() - booking.getDataValue("date") <= 30 && now() - booking.getDataValue("date") > 0) {
                    bookings.push(booking);
                }
            }
            return bookings;
        } else if (time === "last 3 months" && room !== "overall") {
            let users = this.getUsersInGroup(team);
            let bookingsByUserAndRoom = [];
            for (email in users) {
                let models = await Booking.findAll({
                    where: {
                        userEmail: email,
                        deskRoom: room,
                    },
                });
                for (let model in models) {
                    bookingsByUserAndRoom.push(models[model]);
                }
            }
            for (let booking in bookingsByUserAndRoom) {
                if (now() - booking.getDataValue("date") <= 90 && now() - booking.getDataValue("date") > 0) {
                    bookings.push(booking);
                }
            }
            return bookings;
        } else if (time === "next week" && room !== "overall") {
            let users = this.getUsersInGroup(team);
            let bookingsByUserAndRoom = [];
            for (email in users) {
                let models = await Booking.findAll({
                    where: {
                        userEmail: email,
                        deskRoom: room,
                    },
                });
                for (let model in models) {
                    bookingsByUserAndRoom.push(models[model]);
                }
            }
            for (let booking in bookingsByUserAndRoom) {
                if (booking.getDataValue("date") - now() <= 7 && booking.getDataValue("date") - now() > 0) {
                    bookings.push(booking);
                }
            }
            return bookings;
        }
    },
};
