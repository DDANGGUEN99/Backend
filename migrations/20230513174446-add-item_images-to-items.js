'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Items', 'item_images', {
      type: Sequelize.STRING,
      allowNull: true,
			after: 'likes'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Items', 'item_images');
  }
};
