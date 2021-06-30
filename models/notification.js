module.exports = (sequelize, type) => {
    return sequelize.define('notification', {
        id: {
            type: type.UUID,
            defaultValue: type.UUIDV4,
            primaryKey: true
        },
        date: {
            type: type.DATEONLY
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