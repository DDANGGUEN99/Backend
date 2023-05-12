const UserService = require('../services/user.service');

class UserController {
  userService = new UserService();

  // 이메일 중복검사
  checkEmail = async (req, res) => {
    const { email } = req.body;

    // email 유효성 검사
    if (!email)
      return res.status(400).json({ errorMessage: '데이터 형식 비정상' });

    // Users.email 검색
    const user = await this.userService.getUserWithEmail(email);
    if (!user) {
      return res.status(200).end();
    } else {
      return res.status(412).json({ errorMessage: '사용중인 이메일' });
    }
  };

  // 닉네임 중복검사
  checkNickname = async (req, res) => {
    const { nickname } = req.body;

    // nickname 유효성 검사
    if (!nickname)
      return res.status(400).json({ errorMessage: '데이터 형식 비정상' });

    // Users.nickname 검색
    const user = await this.userService.getUserWithNickname(nickname);
    if (!user) {
      return res.status(200).end();
    } else {
      return res.status(412).json({ errorMessage: '사용중인 닉네임' });
    }
  };

  // 회원 가입
  signup = async (req, res) => {
    const { email, nickname, password, location_id } = req.body;

    // input data 유효성 검사
    // if (!email || !nickname || !password || !location_id) {
    //   res.status(412).json({ errorMessage: '데이터 형식 비정상' });
    // }

    // 패스워드에 닉네임 포함여부 검사
    if (password.includes(nickname)) {
      res.status(412).json({ errorMessage: '패스워드에 닉네임 포함' });
    }

    // 회원등록
    const result = await this.userService.signup(
      nickname,
      email,
      password,
      location_id,
    );

    // 결과 피드백
    if (!result) {
      return res.status(412).json({ errorMessage: '회원가입 실패' });
    } else {
      return res.status(200).end();
    }
  };
}

module.exports = UserController;
