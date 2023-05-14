const { Op } = require('sequelize');
const { Items, Likes } = require('../models');
const { Sequelize } = require('sequelize');

class ItemRepository {
  constructor(items) {
    this.itemsModel = items;
  }

  // 거래글 생성 : post는 객체
  createItem2 = async (post) => {
    console.log(`nickname: ${post.nickname}`);

    const createPost = await this.itemsModel.create({
      ...post,
      category_id: 1,
      price: 100,
    });

    return createPost;
  };

  // status 관련 코드도 추가해야 됨
  findAll = async (findInfo) => {
    const { page, location_id, user_id } = findInfo;
    const limit = 10;
    const offset = (page - 1) * limit;
    const items = await this.itemsModel.findAll({
      include: [
        {
          model: Likes,
          attributes: [],
          where: { user_id },
          required: false,
        },
      ],
      where: { location_id },
      limit,
      offset,
    });
    return items;
  };

  findOne = async (item_id) => {
    return await this.itemsModel.findOne({
      where: { item_id },
    });
  };

  destroy = async (itemInfo) => {
    await this.itemsModel.destroy({
      where: itemInfo,
    });
  };

  isLiked = async (findInfo) => {
    const like = await this.Likes.findOne({
      where: findInfo,
    });
    if (!like) {
      return false;
    } else {
      return true;
    }
  };

  // [채민][repository] 판매글 작성, 수정 ==================================================
  // 판매글 생성
  setItem = async (item) => {
    return await this.itemsModel.create({
      user_id : item.user_id,
      nickname : item.nickname,
      category_id : item.category_id,
      title : item.title,
      content : item.content,
      price : item.price,
      location_id : item.location_id,
      status : item.status,
      item_images : item.item_images,
    });
  };

  // 판매글 수정
  updateItem = async (item) => {
    const updateItemData = await this.itemsModel.update(
      {
        ...item
      },
      { where: { item_id : item.item_id } },
    );
    return updateItemData;
  };

  // 판매글 찾기용
  getItemOne = async (item_id) => {
    return await this.itemsModel.findOne({ where: { item_id }});
  }

  // 판매글 status 수정
  updateStatus = async (item) => {
    const updateStatus = await this.itemsModel.update(
      {
        ...item,
        updatedAt: String(Date.now()),
      },
      { where: { item_id: item.item_id } },
    );

    if (updateStatus) {
      return { message: '상태가 수정되었습니다.' };
    } else {
      return { message: '수정 실패' };
    }
  };
}

module.exports = ItemRepository;
