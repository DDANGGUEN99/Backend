const ItemService = require('../services/item.service');
const AppError = require('../utils/appError');

class ItemController {
  itemService = new ItemService();

  getItems = async (req, res, next) => {
    try {
      if (!title || !content) {
        throw new AppError(412, '데이터 형식이 올바르지 않습니다.');
      }
      this.itemService.getItems();
    } catch (error) {
      next(error, req, res, '게시글 작성에 실패하였습니다.');
    }
  }

  getItem = async (req, res, next) => {
    try {
      this.itemService.getItem();
    } catch (error) {
      
    }
  }

  deleteItem = async (req, res, next) => {
    try {
      this.itemService.deleteItem();
    } catch (error) {
      
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