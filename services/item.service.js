const ItemRepository = require("../repositories/item.repository");

const { Item } = require("../models");

const { sequelize } = require("../models");

class ItemService {
  itemRepository = new ItemRepository(Item);

  getItems = async (req, res, next) => {
    try {
      if (!title || !content) {
        throw new AppError(412, '데이터 형식이 올바르지 않습니다.');
      }
      this.itemRepository.findAll();
    } catch (error) {
      next(error, req, res, '게시글 작성에 실패하였습니다.');
    }
  }

  getItem = async (req, res, next) => {
    try {
      this.itemRepository.findOne();
    } catch (error) {
      
    }
  }

  deleteItem = async (req, res, next) => {
    try {
      this.itemRepository.destroy();
    } catch (error) {
      
    }
  }
}


// [채민][service] 판매글 작성, 수정 ==================================================
  // 판매글 생성
  createPost = async (req, res) => {
    const { category_id, title, content, price } = req.body;
    const { user_id, location_id, nickname, user_image } = res.locals.user;

    // 파일이 있으면 key값으로 이름을 정해주고 없으면 null
    const imageFileName = req.file ? req.file.key : null;

    // imageFileName에 파일명이 들어 갔으면 s3 url주소를 추가
    const postImgUrl = imageFileName
      ? process.env.S3_STORAGE_URL + imageFileName
      : null;

    const post = {
      user_id,
      nickname,
      user_image,
      category_id,
      location_id,
      title,
      content,
      postImgUrl,
      price,
    };

    return await this.itemRepository.createPost(post);
  };

  //판매글 수정
  updatePost = async (req, res) => {
    const { user_id, location_id } = res.locals.user;

    const { item_id } = req.params;

    const { category_id, title, content, price } = req.body;

    // 파일이 있으면 key값으로 이름을 정해주고 없으면 null
    const imageFileName = req.file ? req.file.key : null;

    // imageFileName에 파일명이 들어 갔으면 s3 url주소를 추가
    const postImgUrl = imageFileName
      ? process.env.S3_STORAGE_URL + imageFileName
      : undefined;

    const post = {
      user_id,
      category_id,
      location_id,
      title,
      content,
      postImgUrl: postImgUrl,
      price,
    };

    // title 없을 때
    if (!title) res.status(400).send({ message: '제목을 입력해주세요.' });
    // title 공백으로 시작할 때
    if (/^[\s]+/.test(title))
      res.status(400).send({ message: '제목은 공백으로 시작할 수 없습니다.' });

    const findOnePost = await this.itemRepository.findOnePost(item_id);
    if (!findOnePost) throw new error('존재하지 않는 게시글입니다.');
    if (findOnePost.user_id !== user_id) throw new error('수정 권한이 없습니다.');

    await this.itemRepository.updatePost(item_id, post);
  };

  // 거래글 status 수정
  updateStatus = async (req, res) => {
    const { user_id } = res.locals.user;

    const { item_id } = req.params;

    const { status } = req.body;

    const findOnePost = await this.itemRepository.findOnePost(item_id);

    const post = {
      item_id,
      user_id,
      status,
    };

    if (!findOnePost) throw new error('존재하지 않는 판매글입니다.');
    if (findOnePost.user_id !== user_id) throw new error('수정 권한이 없습니다.');

    if (status === 2) {
      await this.itemRepository.updateStatus(post);
      await this.itemRepository.createTransaction(item_id, user_id);
    } else {
      await this.itemRepository.updateStatus(post);
    }
  };



module.exports = ItemService;
