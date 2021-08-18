module.exports = (sequelize, type) => {
    return sequelize.define(
        "adminOption", {
            key: {
                type: type.STRING,
                primaryKey: true,
            },
            value: {
                type: type.INTEGER,
            },
        }, {
            timestamps: false,
        }
    );
};
