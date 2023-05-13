const { Posts, Likes } = require('../models');

class LikeRepository {
  findlikePost = async (user_id) => {
    const likePosts = await Posts.findAll({
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
    return likePosts;
  };

  findOne = async (post_id, user_id) => {
    return await Likes.findOne({
      where: post_id,
      user_id,
      attributes: ['like_id'],
    });
  };

  create = async (post_id, user_id) => {
    await Likes.create({ post_id, user_id });
  };

  destroy = async (post_id, user_id) => {
    await Likes.destroy({
      where: { post_id, user_id },
    });
  };
}

module.exports = LikeRepository;
