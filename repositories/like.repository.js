const { Items, Likes } = require('../models');

class LikeRepository {
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

  findOne = async (item_id, user_id) => {
    return await Likes.findOne({
      where: { item_id, user_id },
      attributes: ['like_id'],
    });
  };

  create = async (item_id, user_id) => {
    await Likes.create({ item_id, user_id });
  };

  destroy = async (item_id, user_id) => {
    await Likes.destroy({
      where: { item_id, user_id },
    });
  };
}

module.exports = LikeRepository;
