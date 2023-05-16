'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Items extends Model {
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
        onDelete: 'CASCADE',
      });

      this.hasMany(models.Likes, {
        sourceKey: 'item_id',
        foreignKey: 'item_id',
      });

      this.hasMany(models.ChatRooms, {
        sourceKey: 'item_id',
        foreignKey: 'item_id',
      });
    }
  }
  Items.init(
    {
      item_id: {
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
        onDelete: 'CASCADE',
      },
      nickname: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      category_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      title: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      content: {
        allowNull: true,
        type: DataTypes.TEXT,
      },
      price: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      location_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      status: {
        allowNull: false,
        type: DataTypes.CHAR(1),
        defaultValue: 'N',
      },
      likes: {
        allowNull: false,
        defaultValue: 0,
        type: DataTypes.INTEGER,
      },
      item_images: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Items',
    },
  );
  return Items;
};
