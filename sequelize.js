const Sequelize = require('sequelize');
const UserModel = require('./models/user');
const DeskModel = require('./models/desk');
const BookingModel = require('./models/booking');
const GroupModel = require('./models/group');
const NotificationModel = require('./models/notification');

//const sequelize = new Sequelize('sqlite::memory:');
const sequelize = new Sequelize('hotdesking', 'Group15', 'Group15!', {
    host: 'ttl-hotdesking-system.cje6t78s3xcx.eu-west-1.rds.amazonaws.com',
    dialect: 'mysql',
});

const User = UserModel(sequelize, Sequelize);
const Desk = DeskModel(sequelize, Sequelize);
const Booking = BookingModel(sequelize, Sequelize);
const Group = GroupModel(sequelize, Sequelize);
const Notification = NotificationModel(sequelize, Sequelize);

User.hasMany(Booking, {
    onDelete: 'CASCADE',
    foreignKey: {
        name: 'userEmail',
        primaryKey: true
    }
});
Booking.belongsTo(User);

Desk.hasMany(Booking, {
    onDelete: 'CASCADE',
    foreignKey: {
        name: 'deskId',
        primaryKey: true
    }
});
Booking.belongsTo(Desk);

Desk.hasMany(Booking, {
    onDelete: 'CASCADE',
    foreignKey: {
        name: 'deskRoom',
        primaryKey: true
    }
});
Booking.belongsTo(Desk);

User.hasMany(Group, {
    onDelete: 'CASCADE',
    foreignKey: {
        name: 'userEmail',
        primaryKey: true
    }
});
Group.belongsTo(User);

sequelize.sync()
.then(() => {
    console.log("Database & tables created");
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
    Notification
};
