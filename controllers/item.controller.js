const ItemService = require('../services/item.service');
const AppError = require('../utils/appError');

class ItemController {
  constructor() {
    this.itemService = new ItemService();
  }

  // 판매글 생성
  setItem = async (req, res, next) => {
    try {
      const { user_id, nickname, location_id } = res.locals.user;
      const { category_id, title, content, price, item_images } = req.body;
      // const item_images = req.files.map(file => file.originalname);
      // let item_images;
      // if (req.img_url) {
      //   item_images = req.img_url.toString();
      // } else {
      //   item_images = null;
      // }

      const itemData = {
        user_id,
        nickname,
        category_id,
        title,
        content,
        price,
        location_id,
        item_images,
      };

      // console.log('item_images', item_images);

      // 예외처리 / 검증 해야함 (추후)
      await this.itemService.setItem(itemData);
      return res.status(200).json({ itemData });
    } catch (error) {
      console.error(error);
      // next(error, req, res, '판매글 작성 실패');
      return res.status(400).json({ message: '판매글 작성 실패' });
    }
  };

  // 판매글 전체 조회
  getItems = async (req, res, next) => {
    try {
      const page = Number(req.query.page);
      const { user_id, location_id } = res.locals.user;
      const findInfo = { page, location_id, user_id };
      const items = await this.itemService.getItems(findInfo);
      res.status(200).json({ items });
    } catch (error) {
      next(error, req, res, '판매글 조회에 실패하였습니다.');
    }
  };

  // 판매글 상세 조회
  getItem = async (req, res, next) => {
    try {
      const { item_id } = req.params;
      const { user_id } = res.locals.user;
      const findInfo = { item_id, user_id };
      const item = await this.itemService.getItem(findInfo);
      const myItems = await this.itemService.getMyItems(findInfo);
      if (!myItems) {
        res.status(400).json({ message: "판매글 없음"})
      } else {
        res.status(200).json({ item, myItems });
      }
    } catch (error) {
      next(error, req, res, '판매글 조회에 실패하였습니다.');
    }
  };

  // 판매글 수정
  updateItem = async (req, res, next) => {
    const { item_id } = req.params;
    const { user_id, location_id } = res.locals.user;
    const { category_id, title, content, price, status, item_images } = req.body;

    // let item_images;
    // if (req.img_url) {
    //   item_images = req.img_url.toString();
    // } else {
    //   const findInfo = { item_id, user_id };
    //   const ItemData = await this.itemService.getItem(findInfo);
    //   item_images = ItemData.item_images;
    // }

    // 입력받은 값을 itemData 객체에 할당
    const itemData = {
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

    // 판매글 수정 처리 결과값 가져오기 (성공: 1, 실패: 0)
    const updateResult = await this.itemService.updateItem(itemData);

    // 판매글 수정 처리 후 정보 가져오기
    const findInfo = { item_id, user_id };
    const getItemData = await this.itemService.getItem(findInfo);

    if (!updateResult) {
      return res.status(400).json({ Message: "판매글 수정 실패"})
    } else {
      return res.status(200).json({ itemData: getItemData });
    }
  };

  // 판매글전용 이미지 업로더
  imgUpload = async (req, res, next) => {
    let item_images;
    if (req.img_url) {
      item_images = req.img_url.toString();
      const item_images_array = item_images.split(',');
      return res.status(200).json({imageData: item_images_array});
    } else {
      item_images = null;
      return res.status(400).send('이미지 업로드 실패');
    }
  };
}

module.exports = ItemController;
