module.exports = (sequelize, type) => {
    return sequelize.define(
        "booking", {
            date: {
                type: type.DATEONLY,
                primaryKey: true,
            },
            am: {
                type: type.BOOLEAN,
                primaryKey: true,
            },
            pm: {
                type: type.BOOLEAN,
                primaryKey: true,
            },
        }, {
            timestamps: false,
        }
    );
};
