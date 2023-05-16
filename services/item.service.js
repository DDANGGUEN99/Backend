require('dotenv').config();
const ItemRepository = require('../repositories/item.repository');
const AppError = require('../utils/appError');
const { Items } = require('../models');
const { sequelize } = require('../models');
const getCategoryName = require('../utils/catetory.util');
const getLocationName = require('../utils/location.util');

class ItemService {
  itemRepository = new ItemRepository(Items);

  getItems = async (findInfo) => {
    const items = await this.itemRepository.findAll(findInfo);
    const itemMap = items.map((item) => {
      item.dataValues.is_liked = !!item.Likes;
      this.itemFormating(item);
      return item; // 여기서 에러 났었음.
    });
    return itemMap;
  };

  getItem = async (findInfo) => {
    const item = await this.itemRepository.findOne(findInfo.item_id);
    if (!item) {
      throw new AppError(404, '판매글 조회에 실패했습니다.');
    }

    item.dataValues.is_liked = await this.itemRepository.isLiked(findInfo);
    this.itemFormating(item);
    return item;
  };

  getItemsHS = async (page) => {
    try {
      return await this.itemRepository.getItemsHS(page);
    } catch (err) {
      console.error(err);
    }
  };

  itemFormating = (item) => {
    item.dataValues.category = getCategoryName(item.dataValues.category_id);
    item.dataValues.location = getLocationName(item.dataValues.location_id);
    delete item.dataValues.category_id;
    delete item.dataValues.location_id;
  };

  deleteItem = async (itemInfo) => {
    const item = await this.itemRepository.findOne(itemInfo.item_id);
    if (!item) {
      throw new AppError(404, '판매글 조회에 실패했습니다.');
    }

    if (item.user_id != itemInfo.user_id) {
      throw new AppError(403, '게시글의 삭제 권한이 존재하지 않습니다.');
    }

    await this.itemRepository.destroy(itemInfo);
  };

  // 판매글 생성
  setItem = async (item) => {
    return await this.itemRepository.setItem(item);
  };

  // 판매글 수정
  updateItem = async (item, user_id) => {
    const itemData = await this.itemRepository.findOne(item.item_id);

    if (!itemData) {
      throw new Error('존재하지 않는 게시글입니다.');
    }

    if (itemData.user_id !== user_id) {
      throw new Error('수정 권한이 없습니다.');
    }
    return await this.itemRepository.updateItem(item);
  };

  getItemOne = async (item_id) => {
    return await this.itemRepository.getItemOne(item_id);
  };
}

module.exports = ItemService;
