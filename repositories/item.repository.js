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

    const createPost = await itemsModel.create({...post});

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
  createPost = async (title, content) => {
    return await this.itemsModel.create({
      title,
      content,
    });
  };

  // 판매글 수정
  updatePost = async (item_id, item) => {
    const updatePost = await this.itemsModel.update(
      {
        ...item,
        updatedAt: String(Date.now()),
      },
      { where: { item_id } },
    );

    if (updatePost) {
      return { message: '판매글이 수정되었습니다.' };
    } else {
      return { message: '수정 실패' };
    }
  };

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
