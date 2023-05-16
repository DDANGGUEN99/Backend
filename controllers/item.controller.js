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
      const { category_id, title, content, price } = req.body;
      // const item_images = req.files.map(file => file.originalname);
      const item_images = req.img_url.toString();
      console.log(item_images);

      const item = {
        user_id,
        nickname,
        category_id,
        title,
        content,
        price,
        location_id,
        item_images,
      };

      console.log('item_images', item_images);

      // 예외처리 / 검증 해야함 (추후)

      await this.itemService.setItem(item);
      return res.status(200).json({ message: '판매글 작성 성공' });
    } catch (error) {
      console.error(error);
      // next(error, req, res, '판매글 작성 실패');
      return res.status(400).json({ message: '판매글 작성 실패' });
    }
  };

  getItems = async (req, res, next) => {
    try {
      const page = Number(req.query.page);
      const { user_id, location_id } = res.locals.user;
      console.log('res.locals.user: TEST: ', user_id, location_id);
      const findInfo = { page, location_id, user_id };
      const items = await this.itemService.getItems(findInfo);
      res.status(200).json({ items });
    } catch (error) {
      next(error, req, res, '판매글 조회에 실패하였습니다.');
    }
  };

  getItemsHS = async (req, res, next) => {
    const page = Number(req.query.page);
    const getItemsData = await this.itemService.getItemsHS(page);
    if (getItemsData) {
      return res.status(200).json({ itemsData: getItemsData });
    } else {
      return res.status(400).send('판매글 조회 실패');
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
      const { category_id, title, content, price, status, item_images } =
        req.body;

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

      await this.itemService.updateItem(item, user_id);

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
