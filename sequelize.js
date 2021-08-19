const Sequelize = require('sequelize');
const UserModel = require('./models/user');
const DeskModel = require('./models/desk');
const BookingModel = require('./models/booking');
const GroupModel = require('./models/group');
const NotificationModel = require('./models/notification');
const AppointmentModel = require('./models/appointment');
const RoomModel = require('./models/room');
const AdminOptionModel = require('./models/adminOption');

// const sequelize = new Sequelize('sqlite::memory:');
const sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.DB_USER_ID,
    process.env.DB_PASS,
    {
        host: process.env.DB_ENDPOINT,
        dialect: 'mysql'
    });

const User = UserModel(sequelize, Sequelize);
const Desk = DeskModel(sequelize, Sequelize);
const Booking = BookingModel(sequelize, Sequelize);
const Group = GroupModel(sequelize, Sequelize);
const Notification = NotificationModel(sequelize, Sequelize);
const Appointment = AppointmentModel(sequelize, Sequelize);
const Room = RoomModel(sequelize, Sequelize);
const AdminOption = AdminOptionModel(sequelize, Sequelize);

User.hasMany(Booking, {
    onDelete: 'CASCADE',
    hooks: true,
    foreignKey: {
        name: 'userEmail'
    }
});
Booking.belongsTo(User);

Desk.hasMany(Booking, {
    onDelete: 'CASCADE',
    hooks: true,
    foreignKey: {
        name: 'deskId',
        primaryKey: true
    }
});
Desk.hasMany(Booking, {
    onDelete: 'CASCADE',
    hooks: true,
    foreignKey: {
        name: 'deskRoom',
        primaryKey: true
    },
    sourceKey: 'room'
});
Booking.belongsTo(Desk);

User.hasMany(Group, {
    onDelete: 'CASCADE',
    hooks: true,
    foreignKey: {
        name: 'userEmail',
        primaryKey: true
    }
});
Group.belongsTo(User);

Room.hasMany(Appointment, {
    onDelete: 'CASCADE',
    hooks: true,
    foreignKey: {
        name: 'roomName'
    }
});

User.hasMany(Appointment, {
    onDelete: 'CASCADE',
    hooks: true,
    foreignKey: {
        name: 'bookedBy'
    }
});

sequelize
    .sync()
    .then(() => {
        console.log('Database & tables created');
    })
    .catch((err) => {
        console.log(err);
    });

module.exports = {
    sequelize,
    User,
    Desk,
    Booking,
    Group,
    Notification,
    Appointment,
    Room,
    AdminOption
};
