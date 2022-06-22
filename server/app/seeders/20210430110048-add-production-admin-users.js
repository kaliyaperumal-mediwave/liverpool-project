'use strict';
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [
      {
        first_name: 'Service Admin',
        last_name: 'CAMHS Referrals',
        uuid: uuidv4(),
        email: 'crisiscareandedysadmin@alderhey.nhs.uk',
        password: await bcrypt.hash('Ald3rHeyLp00l!', saltRounds),
        user_role: 'service_admin',
        service_type: 'Alder Hey - Liverpool CAMHS - EDYS',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        first_name: 'Service Admin',
        last_name: 'YPAS',
        uuid: uuidv4(),
        email: 'referrals.liverpoolypas@nhs.net',
        password: await bcrypt.hash('Ypasr3fferals!', saltRounds),
        user_role: 'service_admin',
        service_type: 'YPAS',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        first_name: 'Service Admin',
        last_name: 'MHST Liverpool',
        uuid: uuidv4(),
        email: 'alliy.gallagher-rice@ypas.org.uk',
        password: await bcrypt.hash('MHSTLp00l!', saltRounds),
        user_role: 'service_admin',
        service_type: 'MHST Liverpool',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        first_name: 'Service Admin',
        last_name: 'Seedlings',
        uuid: uuidv4(),
        email: 'clinicaladmin@ypas.org.uk',
        password: await bcrypt.hash('S33dlings!', saltRounds),
        user_role: 'service_admin',
        service_type: 'Seedlings',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        first_name: 'Service Admin',
        last_name: 'Wellbeing Clinics',
        uuid: uuidv4(),
        email: 'smt@ypas.org.uk',
        password: await bcrypt.hash('W3llbeingClinics!', saltRounds),
        user_role: 'service_admin',
        service_type: 'Wellbeing Clinics',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        first_name: 'Service Admin',
        last_name: 'Alder Hey - Sefton CAMHS - EDYS',
        uuid: uuidv4(),
        email: 'joanne.morgan@alderhey.nhs.uk',
        password: await bcrypt.hash('Ald3rHeySeft0n!', saltRounds),
        user_role: 'service_admin',
        service_type: 'Alder Hey - Sefton CAMHS - EDYS',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        first_name: 'Service Admin',
        last_name: 'Parenting 2000',
        uuid: uuidv4(),
        email: 'referrals@parenting2000.org.uk',
        password: await bcrypt.hash('Par3nting2000!', saltRounds),
        user_role: 'service_admin',
        service_type: 'Parenting 2000',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        first_name: 'Service Admin',
        last_name: 'Venus',
        uuid: uuidv4(),
        email: 'referrals@venuscharity.org',
        password: await bcrypt.hash('V3nusr3fferals!', saltRounds),
        user_role: 'service_admin',
        service_type: 'Venus',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        first_name: 'Service Admin',
        last_name: 'MHST Sefton',
        uuid: uuidv4(),
        email: 'sefton.mhst@alderhey.nhs.uk',
        password: await bcrypt.hash('MHSTS3ft0n!', saltRounds),
        user_role: 'service_admin',
        service_type: 'MHST Sefton',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', {
      email: [
        'crisiscareandedysadmin@alderhey.nhs.uk',
        'camhs.referrals+1@alderhey.nhs.uk',
        'referrals.liverpoolypas@nhs.net',
        'referrals.liverpoolypas+1@nhs.net',
        'alliy.gallagher-rice@ypas.org.uk',
        'clinicaladmin@ypas.org.uk',
        'joanne.morgan@alderhey.nhs.uk',
        'referrals.liverpoolypas+2@nhs.net',
        'referrals.liverpoolypas+3@nhs.net',
        'referrals.liverpoolypas+4@nhs.net',
        'referrals@parenting2000.org.uk',
        'camhs.referrals+2@alderhey.nhs.uk',
        'victoria.furfie@alderhey.nhs.uk',
        'referrals@venuscharity.org',
        'sefton.mhst@alderhey.nhs.uk',
      ],
    });
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
