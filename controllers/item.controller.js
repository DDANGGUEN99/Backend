const ItemService = require('../services/item.service');
const AppError = require('../utils/appError');

class ItemController {
  constructor() {
    this.itemService = new ItemService();
  }

  getItems = async (req, res, next) => {
    try {
      const items = await this.itemService.getItems();
      res.status(200).json({
        success: true,
        data: items,
      });
    } catch (error) {
      next(error);
    }
  };

  getItem = async (req, res, next) => {
    try {
      const { item_id } = req.params;
      const item = await this.itemService.getItem(item_id);
      res.status(200).json({
        success: true,
        data: item,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteItem = async (req, res, next) => {
    try {
      const { item_id } = req.params;
      await this.itemService.deleteItem(item_id);
      res.status(200).json({
        success: true,
        message: '게시글이 삭제되었습니다.',
      });
    } catch (error) {
      next(error);
    }
  };

  createPost = async (req, res, next) => {
    try {
      const { title, content } = req.body;
      const post = await this.itemService.createPost({ title, content });
      res.status(201).json({
        success: true,
        message: '판매글이 생성되었습니다.',
        item_id: post.item_id,
      });
    } catch (error) {
      next(error);
    }
  };

  updatePost = async (req, res, next) => {
    try {
      const { item_id } = req.params;
      const { title, content } = req.body;
      await this.itemService.updatePost(item_id, { title, content });
      res.status(200).json({
        success: true,
        message: '판매글이 수정되었습니다.',
      });
    } catch (error) {
      next(error);
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
      next(error);
    }
  };
}

module.exports = ItemController;
