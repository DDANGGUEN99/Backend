const { Items, Likes } = require('../models');
const { Op } = require('sequelize');

class LikeRepository {
  findOne = async (item_id, user_id) => {
    return await Likes.findOne({
      where: { item_id, user_id },
      attributes: ['like_id'],
    });
  };

  updatelikedb = async (item_id, user_id) => {
    const existsLikes = await Likes.findOne({
      where: {
        [Op.and]: [{ item_id: item_id }, { user_id: user_id }],
      },
    });
    if (existsLikes) {
      await Likes.destroy({
        where: {
          [Op.and]: [{ item_id: item_id }, { user_id: user_id }],
        },
      });
      return 'likesDestroy';
    } else {
      await Likes.create({
        item_id: item_id,
        user_id: user_id,
      });
      return 'likesCreate';
    }
  };

  destroy = async (item_id, user_id) => {
    const decrementLikes = await Items.decrement('likes', {
      where: { item_id, user_id },
      attributes: ['like_id'],
    });
    return decrementLikes;
  };

  create = async (item_id, user_id) => {
    const incrementLikes = await Items.increment('likes', {
      where: { item_id, user_id },
      attributes: ['like_id'],
    });
    return incrementLikes;
  };

  findlikeItem = async (user_id) => {
    const likeItems = await Items.findAll({
      order: [['createdAt', 'desc']],
      include: [
        {
          model: Likes,
          where: { user_id },
          attributes: [],
          required: false,
        },
      ],
    });
    return likeItems;
  };
}

module.exports = LikeRepository;
