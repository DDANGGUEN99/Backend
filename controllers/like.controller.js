const LikeService = require('../services/like.service');

class LikesController {
  likeService = new LikeService();

  putlike = async (req, res) => {
    try {
      const { user_id } = res.locals.user;
      const { item_id } = req.params;

      const like = await this.likesService.putlike(item_id, user_id);

      res.status(200).json({ message: like });
    } catch (error) {
      errorHandling(error, req, res, '관심목록 등록에 실패하였습니다.');
    }
  };

  getlikeItem = async (req, res) => {
    try {
      const { user_id } = res.locals.user;
      const items = await this.likeService.getlikeItem(user_id);
      return res.status(200).json({ items });
    } catch (error) {
      errorHandling(error, req, res, '관심목록 조회에 실패하였습니다.');
    }
  };
}

module.exports = LikesController;
