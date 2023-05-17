'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChatRooms extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Items, {
        targetKey: 'item_id',
        foreignKey: 'item_id',
      });

      this.belongsTo(models.Users, {
        targetKey: 'user_id',
        foreignKey: 'seller_id',
        as: 'Seller'
      });

      this.belongsTo(models.Users, {
        targetKey: 'user_id',
        foreignKey: 'buyer_id',
        as: 'Buyer'
      });

      this.hasMany(models.Chats, {
        sourceKey: 'room_id',
        foreignKey: 'room_id',
      });
    }
  }
  ChatRooms.init({
    room_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    item_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Items',
        key: 'item_id',
      },
    },
    seller_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'user_id',
      },
    },
    buyer_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'user_id',
      },
    },
    status: {
      allowNull: false,
      type: DataTypes.CHAR(1),
      defaultValue: 'N',
    },
    sale_status: {
      allowNull: false,
      type: DataTypes.CHAR(1),
      defaultValue: 'N',
    },
    purchase_status: {
      allowNull: false,
      type: DataTypes.CHAR(1),
      defaultValue: 'N',
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
    modelName: 'ChatRooms',
  });
  return ChatRooms;
};