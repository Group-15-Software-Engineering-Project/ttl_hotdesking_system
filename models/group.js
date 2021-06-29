module.exports = (sequelize, type) => {
    return sequelize.define('group', {
        name: {
            type: type.STRING,
            primaryKey: true
        }
    },{
        timestamps: false
    });
};