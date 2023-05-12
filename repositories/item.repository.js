const { Op } = require("sequelize");
const { Item } = require("../models");
const { Sequelize } = require("sequelize");

class ItemRepository {
  constructor(itemsModel) {
    this.itemsModel = itemsModel;
  }
}

module.exports = WorldcupRepository;
