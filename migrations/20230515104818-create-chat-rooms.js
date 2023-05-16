'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ChatRooms', {
      room_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      item_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Items',
          key: 'item_id',
        },
      },
      seller_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'user_id',
        },
      },
      buyer_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'user_id',
        },
      },
      status: { // N - 정상, D - 삭제됨
        allowNull: false,
        type: Sequelize.CHAR(1),
        defaultValue: 'N',
      },
      sale_status: { // N - 정상, C - 판매완료
        allowNull: false,
        type: Sequelize.CHAR(1),
        defaultValue: 'N',
      },
      purchase_status: { // N - 정상, C - 구매 완료
        allowNull: false,
        type: Sequelize.CHAR(1),
        defaultValue: 'N',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ChatRooms');
  }
};