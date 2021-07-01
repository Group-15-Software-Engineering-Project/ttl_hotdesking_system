module.exports = (sequelize, type) => {
    return sequelize.define(
        "notification",
        {
            start: {
                type: type.DATEONLY,
            },
            end: {
                type: type.DATEONLY,
            },
            id: {
                type: type.UUID,
                defaultValue: type.UUIDV4,
                primaryKey: true,
            },
            type: {
                type: type.STRING,
            },
            title: {
                type: type.STRING,
            },
            body: {
                type: type.STRING(1000),
            },
        },
        {
            timestamps: false,
        }
    );
};
