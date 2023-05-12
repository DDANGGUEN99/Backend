const { Op } = require('sequelize');
const { Item } = require('../models');
const { Sequelize } = require('sequelize');

class ItemRepository {
  constructor(itemsModel) {
    this.itemsModel = itemsModel;
  }

  findAll = async () => {
    await this.itemsModel.findAll();
  }

  findOne = async (item_id) => {
    await this.itemsModel.findOne({
      where: { item_id },
    });
  }

  destory = async (item_id) => {
    await this.itemsModel.destory({
      where: { item_id },
    })
  }
}

module.exports = ItemRepository;