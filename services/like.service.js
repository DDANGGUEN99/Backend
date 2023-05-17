const LikeRepository = require('../repositories/like.repository.js');
const ItemRepository = require('../repositories/item.repository.js');
const { Items } = require('../models');
const AppError = require('../utils/appError');

class ItemService {
  likeRepository = new LikeRepository();
  itemRepository = new ItemRepository(Items);

  putlike = async (item_id, user_id) => {
    try {
      // 관심목록 DB에 이미 등록되었는지 체크
      const getLike = await this.likeRepository.getLikeOne(item_id, user_id);
      if (!getLike) {
        // 없으면 추가
        await this.likeRepository.addLike(item_id, user_id);  // 관심목록 추가
        await this.itemRepository.plusLikes(item_id);  // 판매글 Likes +1
        return true;
      } else {
        // 있으면 제거
        await this.likeRepository.delLike(item_id, user_id);  // 관심목록 제거
        await this.itemRepository.minusLikes(item_id);  // 판매글 Likes -1
        return false;
      }

      // 관심목록 수정처리 (추가/삭제)
      const updateResult = await this.likeRepository.updateLikeDb(
        item_id,
        user_id,
      );

      // 관심목록 추가(T)/삭제(F)에 따른 Items.likes Count Handle
      if (updateResult) {
        // updateResult === true 이면?
        // await this.itemRepository.create(item_id);
        return true;
      } else {
        // await this.itemRepository.destroy(item_id);
        return false;
      }
    } catch (err) {
      console.error(err);
    }
  };

  getlikeItem = async (user_id) => {
    try {
      return await this.likeRepository.findlikeItem(user_id);
    } catch (err) {
      console.error(err);
    }
  };
}

module.exports = ItemService;
