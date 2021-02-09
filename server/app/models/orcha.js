module.exports = function modelOrcha(sequelize, types) {
    const Orcha = sequelize.define('Orcha', {
        id: {
            primaryKey: true,
            type: types.INTEGER,
            autoIncrement: true,
        },
        username: {
            type: types.TEXT,
        },
        password: {
            type: types.TEXT,
        },
        auth_token: {
            type: types.TEXT,
        },
    }, {
        tableName: 'orcha',
    });
    return Orcha;
};
