module.exports = function modelType(sequelize, types) {
    // const Referral = sequelize.model('Referral')
    const referralActivity = sequelize.define('referralActivity', {
        uuid: {
            type: types.UUID,
            defaultValue: types.UUIDV4,
            primarykey: true,
            unique: true,
        },
        activity: {
            type: types.TEXT
        },
        otherInfo: {
            type: types.TEXT
        },
        doneBy: {
            type: types.UUID,
            references: {
                model: 'users',
                key: 'uuid',
            },
        },
        ReferralId: {
            type: types.UUID,
            references: {
                model: sequelize.models.Referral,
                key: 'uuid',
            },
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
        tableName: 'referralActivity',
    });
    referralActivity.associate = function (models) {
        referralActivity.belongsTo(models.User, {
            as: 'userInfo',
            foreignKey: 'doneBy',
            targetKey: 'uuid'
        })
        referralActivity.belongsTo(models.Referral, {
            as: 'referralInfo',
            foreignKey: 'ReferralId',
            targetKey: 'uuid'
        })
    }
    return referralActivity;
};

