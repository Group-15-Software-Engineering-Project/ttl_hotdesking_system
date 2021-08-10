module.exports = (sequelize, type) => {
    return sequelize.define(
        "appointment", {
            id: {
                type: type.UUID,
                defaultValue: type.UUIDV4,
                primaryKey: true,
            },
            title: type.STRING,
            start: type.DATE,
            end: type.DATE
        }, {
            timestamps: false
        }
    );
};