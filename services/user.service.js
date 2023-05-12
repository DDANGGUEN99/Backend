const { Users } = require('../models');
const UserRepository = require('../repositories/user.repository');

class UserService {
  userRepository = new UserRepository(Users);

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
}

module.exports = UserService;
