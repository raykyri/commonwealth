'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.query(
        'DROP TYPE "enum_Users_emailNotificationInterval" CASCADE;'
      );
    } catch (e) {
      console.log(e);
    }

    await queryInterface.addColumn('Users', 'emailNotificationInterval', {
      type: Sequelize.ENUM,
      values: ['daily', 'never'],
      allowNull: false,
      defaultValue: 'never',
    });
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.sequelize.query(
        'DROP TYPE "enum_Users_emailNotificationInterval" CASCADE;'
      );
    } catch (e) {
      console.log(e);
    }
    await queryInterface.addColumn('Users', 'emailNotificationInterval', {
      type: Sequelize.ENUM,
      values: ['daily', 'weekly', 'monthly', 'never'],
      allowNull: false,
      defaultValue: 'never',
    });
  },
};
