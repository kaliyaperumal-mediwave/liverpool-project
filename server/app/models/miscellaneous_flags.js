module.exports = function modelType(sequelize, types) {
    const miscellaneousFlag = sequelize.define('miscellaneousFlag', {
        id: {
            type: types.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        flag: {
            type: types.TEXT,
            unique: true,
        },
        value: {
            type: types.TEXT
        },
        createdAt: {
            type: types.DATE,
            defaultValue: types.NOW
        },
        updatedAt: {
            type: types.DATE,
            defaultValue: types.NOW
        }
    }, {
        tableName: 'miscellaneousFlag',
    });
    return miscellaneousFlag;
};
