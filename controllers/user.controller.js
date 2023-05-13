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
    const { email, nickname, password, location_id, user_image } = req.body;

    // input data 유효성 검사
    if (!email || !nickname || !password || !location_id) {
      return res.status(412).json({ errorMessage: '데이터 형식 비정상' });
    }

    // 패스워드에 닉네임 포함여부 검사
    if (password.includes(nickname)) {
      return res.status(412).json({ errorMessage: '패스워드에 닉네임 포함' });
    }

    // 회원등록
    const result = await this.userService.signup(
      nickname,
      email,
      password,
      location_id,
      user_image,
    );

    // 회원등록 결과
    if (!result) {
      return res.status(412).json({ errorMessage: '회원가입 실패' });
    } else {
      return res.status(200).end();
    }
  };

  // 로그인
  login = async (req, res) => {
    const { email, password } = req.body;

    // email 유효성 검사
    if (!email)
      return res.status(400).json({ errorMessage: '데이터 형식 비정상' });

    // password 유효성 검사
    if (!password)
      return res.status(400).json({ errorMessage: '데이터 형식 비정상' });

    // Users 검색 (with Email)
    const user = await this.userService.getUserWithEmail(email);

    // Users 검색 결과에 따른 응답
    if (!user || user.password !== password) {
      return res
        .status(412)
        .json({ errorMessage: '유저가 없거나 비밀번호 틀림' });
    }

    const [accesstoken, refreshtoken] = await this.userService.login(user);

    const userData = {
      user_id: user.user_id,
      nickname: user.nickname,
      user_image: user.user_image,
    };

    res.cookie('accesstoken', `Bearer ${accesstoken}`);
    res.cookie('refreshtoken', `Bearer ${refreshtoken}`);

    return res.status(200).json({ accesstoken, refreshtoken, userData });
  };

  // 로그인 검증 - 테스트용
  authMiddlewareTest = async (req, res, next) => {
    try {
      return res.status(200).send(res.locals.user);
    } catch (err) {
      console.error(err);
    }
  };

  // 로그아웃
  // logout = async (req, res) => {};

  // 회원정보 조회
  getProfile = async (req, res, next) => {
    const { user_id } = res.locals.user;
    const profileData = await this.userService.getProfile(user_id);

    // 회원정보 조회 결과
    if (!profileData) {
      return res.status(400).json({ errorMessage: '회원정보 조회 실패' });
    } else {
      return res.status(200).json({ userData: profileData });
    }
  };

  // 회원정보 수정
  editProfile = async (req, res, next) => {
    const { user_id } = res.locals.user;
    const { email, nickname, password, location_id, user_image } = req.body;

    // input data 유효성 검사
    // if (!email || !nickname || !password || !location_id) {
    //   return res.status(412).json({ errorMessage: '데이터 형식 비정상' });
    // }

    // 패스워드에 닉네임 포함여부 검사
    // if (password.includes(nickname)) {
    //   return res.status(412).json({ errorMessage: '패스워드에 닉네임 포함' });
    // }

    // 회원정보 수정 처리
    const profileData = await this.userService.editProfile(
      user_id,
      nickname,
      email,
      password,
      location_id,
      user_image,
    );

    // 회원정보 수정 결과
    if (!profileData) {
      return res.status(412).json({ errorMessage: '회원정보 수정 실패' });
    } else {
      return res.status(200).end();
    }
  };

  // 회원 탈퇴
  withdrawal = async (req, res, next) => {
    const { user_id } = res.locals.user;
    const result = await this.userService.withdrawal(user_id);
    if (!result) {
      return res.status(400).json({ errorMessage: '회원탈퇴 실패' });
    } else {
      return res.status(200).end();
    }
  };
}

module.exports = UserController;
