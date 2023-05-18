'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChatDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ChatDetails.init({
    chat_detail_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    room_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'ChatRooms',
        key: 'room_id',
      },
      onDelete: 'CASCADE',
    },
    user_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'user_id',
      },
      onDelete: 'CASCADE',
    },
    yet_chat_count: {
      allowNull: true,
      type: DataTypes.INTEGER,
      defaultValue: 0,
    }
  }, {
    sequelize,
    timestamps: false,
    modelName: 'ChatDetails',
  });
  return ChatDetails;
};