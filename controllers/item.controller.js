const ItemService = require('../services/item.service');
const AppError = require('../utils/appError');

class ItemController {
  itemService = new ItemService();

  getItems = async (req, res, next) => {
    try {
      if (!title || !content) {
        throw new AppError(412, '데이터 형식이 올바르지 않습니다.');
      }
      this.itemService.getItems();
    } catch (error) {
      next(error, req, res, '게시글 작성에 실패하였습니다.');
    }
  }

  getItem = async (req, res, next) => {
    try {
      this.itemService.getItem();
    } catch (error) {
      
    }
  }

  deleteItem = async (req, res, next) => {
    try {
      this.itemService.deleteItem();
    } catch (error) {
      
    }
  }
}

module.exports = ItemController;
