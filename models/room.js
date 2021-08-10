module.exports = (sequelize, type) => {
    return sequelize.define(
        "room", {
            name: {
                type: type.STRING,
                primaryKey: true
            }
        }, {
            timestamps: false
        }
    );
};