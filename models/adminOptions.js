module.exports = (sequelize, type) => {
    return sequelize.define(
        "adminOptions", {
            key: {
                type: type.STRING,
                primaryKey: true,
            },
            value: {
                type: type.INT,
            },
        }, {
            timestamps: false,
        }
    );
};
