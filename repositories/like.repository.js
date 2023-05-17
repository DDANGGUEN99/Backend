const { Items, Likes } = require('../models');
const { Op } = require('sequelize');

class LikeRepository {
  
  // 관심목록 조회
  getLikeOne = async (item_id, user_id) => {
    return await Likes.findOne({
      where: { item_id, user_id },
    })
  }
  
  // 관심목록 추가
  addLike = async (item_id, user_id) => {
    return await Likes.create({item_id, user_id})
  }

  // 관심목록 제거
  delLike = async (item_id, user_id) => {
    return await Likes.destroy({
      where: {item_id, user_id}
    })
  }
}

module.exports = LikeRepository;
