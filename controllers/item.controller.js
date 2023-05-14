const ItemService = require('../services/item.service');
const AppError = require('../utils/appError');

class ItemController {
  constructor() {
    this.itemService = new ItemService();
  }

  // 거래글 생성
  setItem = async (req, res, next) => {
    try {
      const { user_id, nickname, location_id } = res.locals.user;
      const {
        category_id,
        title,
        content,
        price,
        status,
        item_images,
      } = req.body;

      const item = {user_id, nickname, category_id,
        title,
        content,
        price,
        location_id,
        status,
        item_images}

      // 예외처리 / 검증 해야함 (추후)

      await this.itemService.setItem(item);
      return res.status(200).json({ message: '판매글 작성 성공' });
    } catch (error) {
      console.error (error);
      // next(error, req, res, '판매글 작성 실패');
      return res.status(400).json({ message: '판매글 작성 실패' });
    }
  };

  getItems = async (req, res, next) => {
    try {
      const { page } = req.body;
      const { user_id, location_id } = res.locals.user;
      const findInfo = { page, location_id, user_id };
      const items = await this.itemService.getItems(findInfo);
      res.status(200).json({ items });
    } catch (error) {
      next(error, req, res, '판매글 조회에 실패하였습니다.');
    }
  };

  getItem = async (req, res, next) => {
    try {
      const { item_id } = req.params;
      const { user_id } = res.locals.user;
      const findInfo = { item_id, user_id };
      const item = await this.itemService.getItem(findInfo);
      res.status(200).json({ item });
    } catch (error) {
      next(error, req, res, '판매글 조회에 실패하였습니다.');
    }
  };

  deleteItem = async (req, res, next) => {
    try {
      const item_id = req.body;
      const user_id = res.locals.user;
      const itemInfo = { item_id, user_id };
      await this.itemService.deleteItem(itemInfo);
    } catch (error) {
      next(error, req, res, '판매글 삭제에 실패하였습니다.');
    }
  };

  updateItem = async (req, res, next) => {
    try {
      const { item_id } = req.params;
      const { user_id, location_id } = res.locals.user;
      const { category_id, title, content, price, status, item_images } = req.body;

      const item = {
        item_id,
        user_id,
        category_id,
        title,
        content,
        price,
        location_id,
        status,
        item_images,
      };

      const getItemData = await this.itemService.getItemOne(item_id);

      if (!getItemData) {
        throw new Error('존재하지 않는 게시글입니다.');
      }

      if (getItemData.user_id !== user_id) {
        throw new Error('수정 권한이 없습니다.');
      }

      await this.itemService.updateItem(item);

      return res.status(200).end();
    } catch (error) {
      next(error, req, res, '판매글 수정에 실패하였습니다.');
    }
  };

  updateStatus = async (req, res, next) => {
    try {
      const { item_id } = req.params;
      const { status } = req.body;
      await this.itemService.updateStatus(item_id, status);
      res.status(200).json({
        success: true,
        message: '상태가 변경되었습니다.',
      });
    } catch (error) {
      next(error, req, res, '상태 변경에 실패하였습니다.');
    }
  };
}

module.exports = ItemController;
