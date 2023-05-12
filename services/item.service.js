const ItemRepository = require("../repositories/worldcup.repository");

const { Item } = require("../models");

const { sequelize } = require("../models");

class WorldcupService {
  itemRepository = new ItemRepository(Item);

}

module.exports = WorldcupService;
