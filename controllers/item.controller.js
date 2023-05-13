const ItemService = require('../services/item.service');
const AppError = require('../utils/appError');

class ItemController {
  itemService = new ItemService();

  getItems = async (req, res, next) => {
    try {
      const { page, location_id } = req.body;
      const { user_id } = res.locals.user;
      const findInfo = { page, location_id, user_id };
      const items = await this.itemService.getItems(findInfo);
      res.status(200).json({ items });
    } catch (error) {
      next(error, req, res, '판매글 조회에 실패하였습니다.');
    }
  }

  getItem = async (req, res, next) => {
    try {
      const { item_id } = req.body;
      const { user_id } = res.locals.user;
      const findInfo = { item_id, user_id };
      const item = await this.itemService.getItem(findInfo);
      res.status(200).json({ item });
    } catch (error) {
      next(error, req, res, '판매글 조회에 실패하였습니다.');
    }
  }

  deleteItem = async (req, res, next) => {
    try {
      const item_id = req.body;
      const user_id = res.locals.user;
      const itemInfo = { item_id, user_id };
      await this.itemService.deleteItem(itemInfo);
    } catch (error) {
      next(error, req, res, '판매글 삭제에 실패하였습니다.');
    }
  }
}

// [채민][control] 판매글 작성, 수정 ==================================================
  // 판매글 작성
  createPost = async (req, res, next) => {
    try {
      const post = await this.itemService.createPost(req, res);

      res.status(200).send({
        ok: true,
        message: '판매글이 생성되었습니다.',
        item_id: post.item_id,
      });
    } catch (err) {
      next(err);
    }
  };

  // 판매글 수정
  updatePost = async (req, res, next) => {
    try {
      await this.itemService.updatePost(req, res);

      res.status(200).send({ ok: true, message: '판매글이 수정되었습니다.' });
    } catch (err) {
      next(err);
    }
  };

  // 판매글 status 수정
  updateStatus = async (req, res, next) => {
    try {
      await this.itemService.updateStatus(req, res);

      res.status(200).send({ ok: true, message: '상태가 변경되었습니다.' });
    } catch (err) {
      next(err);
    }
  };


  module.exports = ItemController;