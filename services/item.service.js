const ItemRepository = require("../repositories/item.repository");

const { Item } = require("../models");

const { sequelize } = require("../models");

class ItemService {
  itemRepository = new ItemRepository(Item);

  getItems = async (req, res, next) => {
    try {
      if (!title || !content) {
        throw new AppError(412, '데이터 형식이 올바르지 않습니다.');
      }
      this.itemRepository.findAll();
    } catch (error) {
      next(error, req, res, '게시글 작성에 실패하였습니다.');
    }
  }

  getItem = async (req, res, next) => {
    try {
      this.itemRepository.findOne();
    } catch (error) {
      
    }
  }

  deleteItem = async (req, res, next) => {
    try {
      this.itemRepository.destroy();
    } catch (error) {
      
    }
  }
}

module.exports = ItemService;
