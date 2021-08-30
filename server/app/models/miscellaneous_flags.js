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
    }, {
        tableName: 'miscellaneousFlag',
    });
    return miscellaneousFlag;
};
