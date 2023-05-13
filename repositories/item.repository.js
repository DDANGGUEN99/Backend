const { Op } = require('sequelize');
const { Item } = require('../models');
const { Sequelize } = require('sequelize');

class ItemRepository {
  constructor(itemsModel) {
    this.itemsModel = itemsModel;
  }

  findAll = async () => {
    await this.itemsModel.findAll();
  }

  findOne = async (item_id) => {
    await this.itemsModel.findOne({
      where: { item_id },
    });
  }

  destory = async (item_id) => {
    await this.itemsModel.destory({
      where: { item_id },
    })
  }
}

// [채민][repository] 판매글 작성, 수정 ==================================================
  // 판매글 생성
  createPost = async (item) => {
    console.log(`nickname: ${item.nickname}`);

    const createPost = await itemsModel.create({
      ...item,
      createdAt: String(Date.now()),
      updatedAt: String(Date.now()),
    });

    return createPost;
  };

  // 판매글 수정
  updatePost = async (item_id, item) => {
    const updatePost = await itemsModel.update(
      {
        ...item,
        updatedAt: String(Date.now()),
      },
      { where: { item_id } }
    );

    if (updatePost) {
      return { message: '판매글이 수정되었습니다.' };
    } else {
      return { message: '수정 실패' };
    }
  };

  // 판매글 status 수정
  updateStatus = async (item) => {
    const updateStatus = await itemsModel.update(
      {
        ...item,
        updatedAt: String(Date.now()),
      },
      { where: { item_id: item.item_id } }
    );

    if (updateStatus) {
      return { message: '상태가 수정되었습니다.' };
    } else {
      return { message: '수정 실패' };
    }
  };


module.exports = ItemRepository;