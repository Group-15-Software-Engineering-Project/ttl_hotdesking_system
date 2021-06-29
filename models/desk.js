module.exports = (sequelize, type) => {
    return sequelize.define('desk', {
        id: {
            type: type.INTEGER,
            primaryKey: true
        },
        room: {
            type: type.STRING,
            primaryKey: true
        }
    },{
        timestamps: false
    });
};