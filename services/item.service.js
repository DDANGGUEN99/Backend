require('dotenv').config();
const ItemRepository = require('../repositories/item.repository');
const AppError = require('../utils/appError');
const { Items, Users } = require('../models');
const { sequelize } = require('../models');
const getCategoryName = require('../utils/catetory.util');
const getLocationName = require('../utils/location.util');
const UserRepository = require('../repositories/user.repository');

class ItemService {
  itemRepository = new ItemRepository(Items);
  userRepository = new UserRepository(Users);

  // 판매글 생성
  setItem = async (item) => {
    try {
      return await this.itemRepository.setItem(item);
    } catch (err) {
      console.error(err);
    }
  };

  // 판매글 수정
  updateItem = async (item) => {
    try {
      const itemData = await this.itemRepository.findOne(item.item_id);

      if (!itemData) {
        throw new Error('존재하지 않는 게시글입니다.');
      }

      if (itemData.user_id !== item.user_id) {
        throw new Error('수정 권한이 없습니다.');
      }
      
      return await this.itemRepository.updateItem(item);
    } catch (err) {
      console.error(err);
    }
  };

  // 판매글 전체 조회
  getItems = async (findInfo) => {
    try {
      const items = await this.itemRepository.findAll(findInfo);
      const itemMap = items.map((item) => {
        item.dataValues.is_liked = !!item.Likes;
        if (!item.dataValues.item_images) {
          // console.log('이미지 null 일 때');
          item.dataValues.thumbnail_url = null;
        } else {
          // console.log('이미지 있을 때');
          item.dataValues.thumbnail_url = item.dataValues.item_images.split(
            ',',
            2,
          )[0];
        }
        delete item.dataValues.item_images;
        this.itemFormating(item);
        return item;
      });
      return itemMap;
    } catch (err) {
      console.error(err);
    }
  };

  // 내 판매글 조회
  getMyItems = async (findInfo) => {
    try {
      const items = await this.itemRepository.getMyItems(findInfo);
      const itemMap = items.map((item) => {
        item.dataValues.is_liked = !!item.Likes;
        if (!item.dataValues.item_images) {
          // console.log('이미지 null 일 때');
          item.dataValues.thumbnail_url = null;
        } else {
          // console.log('이미지 있을 때');
          item.dataValues.thumbnail_url = item.dataValues.item_images.split(
            ',',
            2,
          )[0];
        }
        delete item.dataValues.item_images;
        this.itemFormating(item);
        return item;
      });
      return itemMap;
    } catch (err) {
      console.error(err);
    }
  };

  // 판매글 상세 조회
  getItem = async (findInfo) => {
    try {
      const item = await this.itemRepository.findOne(findInfo.item_id);
      if (!item) {
        return null;
      }

      item.dataValues.is_liked = await this.itemRepository.isLiked(findInfo);
      const user = await this.userRepository.getProfile(findInfo.user_id);
      item.dataValues.profile_url = user.user_image;
      this.itemFormating(item);
      return item;
    } catch (err) {
      console.error(err);
    }
  };
  itemFormating = (item) => {
    try {
      item.dataValues.category = getCategoryName(item.dataValues.category_id);
      item.dataValues.location = getLocationName(item.dataValues.location_id);
      delete item.dataValues.category_id;
      delete item.dataValues.location_id;
    } catch (err) {
      console.error(err);
    }
  };
}

module.exports = ItemService;
