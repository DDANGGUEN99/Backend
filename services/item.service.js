require('dotenv').config();
const ItemRepository = require('../repositories/item.repository');
const AppError = require('../utils/appError');
const { Items } = require('../models');
const { sequelize } = require('../models');
const getCategoryName = require('../utils/catetory.util');
const getLocationName = require('../utils/location.util');

class ItemService {
  itemRepository = new ItemRepository(Items);

  // 거래글 생성
  postItem = async (req, res) => {
    const { category_id, title, content, price } = req.body;
    const { user_id, nickname, location_id, user_image } = res.locals.user;

    // 파일이 있으면 key값으로 이름을 정해주고 없으면 null
    const imageFileName = req.file ? req.file.key : null;

    // imageFileName에 파일명이 들어 갔으면 s3 url주소를 추가
    const postImgUrl = imageFileName
      ? process.env.S3_STORAGE_URL + imageFileName
      : null;

    const post = {
      user_id,
      nickname,
      category_id,
      location_id,
      title,
      content,
      user_image,
      price,
    };

    return await this.itemRepository.createItem2(post);
  };

  getItems = async (findInfo) => {
    const items = await this.itemRepository.findAll(findInfo);
    return items.map((item) => {
      item.dataValues.is_liked = item.Likes.length > 0;
      item.dataValues.category = getCategoryName(item.dataValues.category_id);
      item.dataValues.location = getLocationName(item.dataValues.location_id);
      return items;
    });
  };

  getItem = async (findInfo) => {
    const item = await this.itemRepository.findOne(findInfo.item_id);
    if (!item) {
      throw new AppError(404, '판매글 조회에 실패했습니다.');
    }
    item.dataValues.is_liked = await this.itemRepository.isLiked(findInfo);
    item.dataValues.category = getCategoryName(item.dataValues.category_id);
    item.dataValues.location = getLocationName(item.dataValues.location_id);
    return item;
  };

  deleteItem = async (itemInfo) => {
    const item = await this.itemRepository.findOne(itemInfo.item_id);
    if (!item) {
      throw new AppError(404, '판매글 조회에 실패했습니다.');
    }

    if (item.user_id != itemInfo.user_id) {
      throw new AppError(403, '게시글의 삭제 권한이 존재하지 않습니다.');
    }

    await this.itemRepository.destroy(itemInfo);
  };

  // [채민][service] 판매글 작성, 수정 ==================================================
  // 판매글 생성
  createPost = async (title, content) => {
    try {
      return await this.itemRepository.createPost(title, content);
    } catch (err) {
      console.error(err);
    }
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
    if (findOnePost.user_id !== user_id)
      throw new error('수정 권한이 없습니다.');

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
    if (findOnePost.user_id !== user_id)
      throw new error('수정 권한이 없습니다.');

    if (status === 2) {
      await this.itemRepository.updateStatus(post);
      await this.itemRepository.createTransaction(item_id, user_id);
    } else {
      await this.itemRepository.updateStatus(post);
    }
  };
}

module.exports = ItemService;
