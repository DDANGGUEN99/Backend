const LikeService = require('../services/like.service.js');
const ItemService = require('../services/item.service.js');

class LikesController {
  likeService = new LikeService();
  itemService = new ItemService();

  putlike = async (req, res, next) => {
    const { user_id } = res.locals.user;
    const { item_id } = req.params;

    const findInfo = { item_id, user_id };

    // 예외처리 : 판매글 유효성 검사
    const getItem = await this.itemService.getItem(findInfo);
    if (!getItem) { // getItem === null (즉, 판매글이 없으면)
      res.status(419).send('판매글 없음')
    }

    // 관심목록 수정처리 비즈니스 로직 호출
    const likeResult = await this.likeService.putlike(item_id, user_id);
    console.log(likeResult);

    if (likeResult) {
      res.status(200).end()  // 관심목록 추가했을 때
    } else {
      res.status(204).end()  // 관심목록 삭제했을 때
    }
  };

  getlikeItem = async (req, res, next) => {
    try {
      const { user_id } = res.locals.user;
      const items = await this.likeService.getlikeItem(user_id);
      return res.status(200).json({ items });
    } catch (error) {
      next(error, req, res, '관심목록 조회에 실패하였습니다.');
    }
  };
}

module.exports = LikesController;
