const LikeRepository = require('../repositories/like.repository');
const ItemRepository = require('../repositories/item.repository');
const AppError = require('../utils/appError');

class ItemService {
  likeRepository = new LikeRepository();
  itemRepository = new ItemRepository();

  putlike = async (item_id, user_id) => {
    const item = await this.itemRepository.findOne(item_id);
    if (!item) {
      throw new AppError(404, '판매글이 존재하지 않습니다.');
    }

    const like = await this.likeRepository.findOne(item_id, user_id);
    if (like) {
      await this.likeRepository.destroy(item_id, user_id);
      return '내 관심목록에서 삭제되었습니다.';
    } else {
      await this.likeRepository.create(item_id, user_id);
      return '내 관심목록에 등록되었습니다.';
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
