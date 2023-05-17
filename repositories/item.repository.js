const { Op } = require('sequelize');
const { Likes } = require('../models');
const { Sequelize } = require('sequelize');

class ItemRepository {
  constructor(items) {
    this.itemsModel = items;
  }

  // status 관련 코드도 추가해야 됨
  findAll = async (findInfo) => {
    const { page, location_id, user_id } = findInfo;
    const limit = 10;
    const offset = (page - 1) * limit;
    const items = await this.itemsModel.findAll({
      order: [['item_id', 'DESC']],
      include: [
        {
          model: Likes,
          attributes: [],
          where: { user_id },
          required: false,
        },
      ],
      where: { location_id, status: { [Op.ne]: 'D' } },
      limit,
      offset,
    });
    return items;
  };

  // 내 판매글 조회하기
  getMyItems = async (findInfo) => {
    const { item_id, user_id } = findInfo;
    const limit = 4;
    const items = await this.itemsModel.findAll({
      order: [['item_id', 'DESC']],
      include: [
        {
          model: Likes,
          attributes: [],
          where: { user_id },
          required: false,
        },
      ],
      where: { user_id, status: { [Op.ne]: 'D' }, item_id: { [Op.ne]: item_id} },
      limit
    });
    return items;
  }

  findOne = async (item_id) => {
    return await this.itemsModel.findOne({
      where: { item_id },
    });
  };

  destroy = async (itemInfo) => {
    await this.itemsModel.update(
      {
        status: 'D',
      },
      {
        where: { item_id: itemInfo.item_id },
      },
    );
  };

  isLiked = async (findInfo) => {
    const like = await Likes.findOne({
      where: findInfo,
    });
    if (!like) {
      return false;
    } else {
      return true;
    }
  };

  // 판매글 생성
  setItem = async (item) => {
    return await this.itemsModel.create({ ...item });
  };

  // 판매글 수정
  updateItem = async (item) => {
    const updateItemData = await this.itemsModel.update(
      {
        ...item,
      },
      { where: { item_id: item.item_id } },
    );
    return updateItemData;
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
