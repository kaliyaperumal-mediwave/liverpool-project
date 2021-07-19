'use strict';
module.exports = {
  //updating values in users table 
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`update users set service_type = 'Alder Hey - Liverpool CAMHS' where service_type = 'Alder Hey - Liverpool CAMHS - EDYS'`);
    await queryInterface.sequelize.query(`update users set service_type = 'Alder Hey - Sefton CAMHS' where service_type = 'Alder Hey - Sefton CAMHS - EDYS'`);
    //updating values in referrals table 
    await queryInterface.sequelize.query(`update referrals set referral_provider = 'Alder Hey - Liverpool CAMHS' where referral_provider = 'Alder Hey - Liverpool CAMHS - EDYS'`);
    await queryInterface.sequelize.query(`update referrals set referral_provider = 'Alder Hey - Sefton CAMHS' where referral_provider = 'Alder Hey - Sefton CAMHS - EDYS'`);
  },
  down: async (queryInterface, Sequelize) => {
    //revert update values in usres table
    await queryInterface.sequelize.query(`update users set service_type = 'Alder Hey - Liverpool CAMHS - EDYS' where service_type = 'Alder Hey - Liverpool CAMHS'`);
    await queryInterface.sequelize.query(`update users set service_type = 'Alder Hey - Sefton CAMHS - EDYS' where service_type = 'Alder Hey - Sefton CAMHS'`);
     //revert update values in referrals table
     await queryInterface.sequelize.query(`update referrals set referral_provider = 'Alder Hey - Liverpool CAMHS - EDYS' where referral_provider = 'Alder Hey - Liverpool CAMHS'`);
     await queryInterface.sequelize.query(`update referrals set referral_provider = 'Alder Hey - Sefton CAMHS - EDYS' where referral_provider = 'Alder Hey - Sefton CAMHS'`);
  }
};