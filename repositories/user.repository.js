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
  signup = async (email, nickname, password, location_id, user_image) => {
    return await this.usersModel.create({
      email,
      nickname,
      password,
      location_id,
      user_image,
    });
  };

  // 회원정보 조회
  getProfile = async (user_id) => {
    return await this.usersModel.findOne({
      attributes: ['user_id', 'nickname', 'email', 'location_id', 'user_image'],
      where: { user_id },
    });
  };

  // 회원정보 수정
  editProfile = async (
    user_id,
    email,
    nickname,
    password,
    location_id,
    user_image,
  ) => {
    return await this.usersModel.update(
      {
        email,
        nickname,
        password,
        location_id,
        user_image,
      },
      {
        where: { user_id: user_id },
      },
    );
  };

  // 회원탈퇴
  withdrawal = async (user_id) => {
    await this.usersModel.destroy({ where: { user_id } });
  };
}

module.exports = UserRepository;
