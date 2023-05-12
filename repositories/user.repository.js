class UserRepository {
  constructor(users) {
    this.usersModel = users;
  }
  // 회원찾기 with email
  getUserWithEmail = async (email) => {
    return await this.usersModel.findOne({ where: { email } });
  };

  // 회원찾기 with nickname
  getUserWithNickname = async (nickname) => {
    return await this.usersModel.findOne({ where: { nickname } });
  };


  // 회원가입
  signup = async (email, nickname, password, location_id) => {
    return await this.usersModel.create({
      email,
      nickname,
      password,
      location_id,
    });
  };
}

module.exports = UserRepository;
