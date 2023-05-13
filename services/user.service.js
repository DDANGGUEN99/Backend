const redis = require('redis');
const jwt = require('../utils/jwt.js');
const { Users } = require('../models');
const UserRepository = require('../repositories/user.repository');
const RedisClientRepository = require('../repositories/redis.repository.js');

class UserService {
  userRepository = new UserRepository(Users);
  redisClientRepository = new RedisClientRepository(redis);

  // 회원찾기 (with email)
  getUserWithEmail = async (email) => {
    try {
      return await this.userRepository.getUserWithEmail(email);
    } catch (err) {
      console.error(err);
    }
  };

  // 회원찾기 (with nickname)
  getUserWithNickname = async (nickname) => {
    try {
      return await this.userRepository.getUserWithNickname(nickname);
    } catch (err) {
      console.error(err);
    }
  };

  // 회원가입
  signup = async (email, nickname, password, location_id, user_image) => {
    try {
      return await this.userRepository.signup(
        nickname,
        email,
        password,
        location_id,
        user_image,
      );
    } catch (err) {
      console.error(err);
    }
  };

  // 로그인
  login = async (user) => {
    try {
      // 토큰 생성
      const accesstoken = jwt.createAccessToken(
        user.user_id,
        user.nickname,
        user.location_id,
        user.user_image,
      );
      const refreshtoken = jwt.createRefreshToken();

      // redis 저장 준비
      const key = refreshtoken;
      const value = JSON.stringify({
        user_id: user.user_id,
        nickname: user.nickname,
        location_id: user.location_id,
        user_image: user.user_image,
      });

      // REDIS 저장 실행
      const EXPIRE_TIME = 1209600; // 14일로 셋팅
      await this.redisClientRepository.setData(key, value, EXPIRE_TIME);
      return [accesstoken, refreshtoken];
    } catch (err) {
      console.error(err);
    }
  };

  // 회원정보 조회
  getProfile = async (user_id) => {
    try {
      const getProfileData = await this.userRepository.getProfile(user_id);
      // 추후 location_id -> location_name으로 변경해서 Fe에 전달해야함
      return getProfileData;
    } catch (err) {
      console.error(err);
    }
  };

  // 회원정보 수정
  editProfile = async (
    user_id,
    nickname,
    email,
    password,
    location_id,
    user_image,
  ) => {
    try {
      const setProfileData = await this.userRepository.editProfile(
        user_id,
        nickname,
        email,
        password,
        location_id,
        user_image,
      );
      return setProfileData;
    } catch (err) {
      console.error(err);
    }
  };

  // 회원탈퇴
  withdrawal = async (user_id) => {
    try {
      return await this.userRepository.withdrawal(user_id);
    } catch (err) {
      console.error(err);
    }
  };
}

module.exports = UserService;
