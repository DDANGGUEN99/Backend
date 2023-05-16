'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chats extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Users, {
        targetKey: 'user_id',
        foreignKey: 'user_id',
      });

      this.belongsTo(models.ChatRooms, {
        targetKey: 'room_id',
        foreignKey: 'room_id',
      });
    }
  }
  Chats.init({
    chat_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    user_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'user_id',
      },
    },
    room_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'ChatRooms',
        key: 'room_id',
      },
    },
    message:  {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    check: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    createdAt: {
      allowNull: false,
      defaultValue: DataTypes.NOW,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      defaultValue: DataTypes.NOW,
      type: DataTypes.DATE,
    }
  }, {
    sequelize,
    modelName: 'Chats',
  });
  return Chats;
};