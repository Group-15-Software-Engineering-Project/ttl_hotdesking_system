module.exports = (sequelize, type) => {
    return sequelize.define(
        "adminOptions", {
            key: {
                type: type.STRING,
                primaryKey: true,
            },
            value: {
                type: type.STRING,
                primaryKey: true,
            },
        }, {
            timestamps: false,
        }
    );
};
