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
    return items.map((item) => {
      item.dataValues.is_liked = item.Likes.length > 0;
      item.dataValues.category = getCategoryName(item.dataValues.category_id);
      item.dataValues.location = getLocationName(item.dataValues.location_id);
      return items;
    });
  };

  getItem = async (findInfo) => {
    const item = await this.itemRepository.findOne(findInfo.item_id);
    if (!item) {
      throw new AppError(404, '판매글 조회에 실패했습니다.');
    }
    item.dataValues.is_liked = await this.itemRepository.isLiked(findInfo);
    item.dataValues.category = getCategoryName(item.dataValues.category_id);
    item.dataValues.location = getLocationName(item.dataValues.location_id);
    return item;
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

  // [채민][service] 판매글 작성, 수정 ==================================================
  // 판매글 생성
  setItem = async (item) => {
    return await this.itemRepository.setItem(item);
  };

  // 판매글 수정
  updateItem = async (item) => {
    return await this.itemRepository.updateItem(item);
  };

  getItemOne = async (item_id) => {
    return await this.itemRepository.getItemOne(item_id);
  } 

  // 거래글 status 수정
  updateStatus = async (req, res) => {
    const { user_id } = res.locals.user;

    const { item_id } = req.params;

    const { status } = req.body;

    const findOnePost = await this.itemRepository.findOnePost(item_id);

    const post = {
      item_id,
      user_id,
      status,
    };

    if (!findOnePost) throw new error('존재하지 않는 판매글입니다.');
    if (findOnePost.user_id !== user_id)
      throw new error('수정 권한이 없습니다.');

    if (status === 2) {
      await this.itemRepository.updateStatus(post);
      await this.itemRepository.createTransaction(item_id, user_id);
    } else {
      await this.itemRepository.updateStatus(post);
    }
  };
}

module.exports = ItemService;
