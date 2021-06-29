const { sequelize, User, Desk, Booking, Group, Notification } = require("../sequelize");
const { QueryTypes, Op } = require("sequelize");

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
    getLocationData: () => {},
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
        let rooms = await Desk.aggregate("room", "DISTINCT");
        return rooms;
    },
    getGroups: async () => {
        let groups = await sequelize.query("SELECT DISTINCT name FROM groups;", {
            type: QueryTypes.SELECT,
        });
        console.log(groups);
        return [];
    },
    getUsers: async () => {
        let users = [];
        let models = await User.findaAll({
            attributes: ["email"],
        });
        for (let model in models) {
            users.push(model.getDataValue("email"));
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
            users.push(model.getDataValue("userEmail"));
        }
        return users;
    },
    getBookings: async (email) => {
        let bookings = [];
        let models = await Booking.findAll({
            where: {
                userEmail: email,
            },
        });
        for (let model in models) {
            bookings.push(model.values);
        }
        return bookings;
    },
    getReports: () => {},
    getBookingsInMonth: (/* TODO */) => {},
    getNotifications: async () => {
        let notifications = [];
        let models = await Notification.findAll({
            where: {
                start: {
                    [Op.lt]: new Date(),
                },
                end: {
                    [Op.gt]: new Date(),
                },
            },
        });
        for (let model in models) {
            notifications.push(JSON.parse(model));
        }
        return notifications;
    },
    addUser: async (email, password) => {
        await User.create({ email: email, password: password });
        await Group.create({ userEmai: email, name: "All Users" });
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
};
