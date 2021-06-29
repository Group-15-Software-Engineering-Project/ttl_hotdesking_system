module.exports = (sequelize, type) => {
    return sequelize.define('notification', {
        id: {
            type: type.INTEGER,
            primaryKey: true
        },
        start: {
            type: type.DATE,
        },
        end: {
            type: type.DATE
        },
        type: {
            type: type.STRING
        },
        title: {
            type: type.STRING
        },
        body: {
            type: type.STRING(1000)
        }
    },{
        timestamps: false
    });
};