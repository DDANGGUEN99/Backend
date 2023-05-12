'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Likes extends Model {
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
        onDelete: 'CASCADE',
      });

      this.belongsTo(models.Users, {
        targetKey: 'user_id',
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
      });
    }
  }
  Likes.init(
    {
      like_id: {
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
    },
    {
      sequelize,
      timestamps: false,
      modelName: 'Likes',
    },
  );
  return Likes;
};
