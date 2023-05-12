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
  signup = async (email, nickname, password, location_id) => {
    try {
      return await this.userRepository.signup(
        nickname,
        email,
        password,
        location_id,
      );
    } catch (err) {
      console.error(err);
    }
  };

  // 로그인
  login = async (user) => {
    // 토큰 생성
    const accesstoken = jwt.createAccessToken(user.user_id, user.nickname);
    const refreshtoken = jwt.createRefreshToken();

    // redis 저장 준비
    const key = refreshtoken;
    const value = JSON.stringify({
      userId: user.userId,
      nickname: user.nickname,
    });

    // REDIS 저장 실행
    const EXPIRE_TIME = 1209600; // 14일로 셋팅
    await this.redisClientRepository.setData(key, value, EXPIRE_TIME);
    return [accesstoken, refreshtoken];
  };

  // 회원정보 조회
  getProfile = async (user_id) => {
    const getProfileData = await this.userRepository.getProfile(user_id);
    // 추후 location_id -> location_name으로 변경해서 Fe에 전달해야함
    return getProfileData;
  };

  // 회원탈퇴
  withdrawal = async (user_id) => {
    return await this.userRepository.withdrawal(user_id);
  };
}

module.exports = UserService;
