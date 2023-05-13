const { Posts, Likes } = require('../models');

class LikeRepository {
  findlikePost = async (user_id) => {
    const likePosts = await Posts.findAll({
      order: [
        ['likes', 'desc'],
        ['createdAt', 'desc'],
      ],
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
    await Likes.create(post_id, user_id);
  };

  destroy = async (post_id, user_id) => {
    await Likes.destroy({
      where: post_id,
      user_id,
    });
  };
}

module.exports = LikeRepository;

//동환님, 저는 op를 이용해서 join했었는데 동환님 에러핸들러 보다가 방식이 달라서 적용을 못했습니다...!!!
//맞는건지 모르겠지만,,,,,,, 쫌다가 설명 좀 부탁드릴게요
