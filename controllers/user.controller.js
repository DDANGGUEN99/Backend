const UserService = require('../services/user.service');
const AppError = require('../utils/appError');
const redisClient = require('../repositories/redis.repository');

class UserController {
  userService = new UserService();

  // 이메일 중복검사
  checkEmail = async (req, res) => {
    const email = req.query.email;
    console.log(email);

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
    const nickname = req.query.nickname;

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

  // 이메일 인증
  userMail = async (req, res, next) => {
    try {
      const { email } = req.body;
      let userNum = Math.random().toString().substring(2, 8);
      await this.userService.senduserMail(email, userNum);
      res.status(200).json({ userNum: userNum });
    } catch (error) {
      throw new AppError(400, '알수없는 이유로 오류가 발생하였습니다.');
    }
  };

  // 회원 가입
  signup = async (req, res) => {
    const { email, nickname, password, location_id, user_image, userCode } =
      req.body;
    const redisGetNum = await redisClient.get(email);

    // 이메일 인증
    if (userCode !== redisGetNum) {
      return res.status(400).json({
        errorMessage: '인증코드가 일치하지 않습니다. 다시 시도해주세요.',
      });
    }

    // input data 유효성 검사
    if (!email || !nickname || !password) {
      return res.status(412).json({ errorMessage: '데이터 형식 비정상' });
    }

    // 상세한 예외처리 Fe 협의 필요

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

  // 로그아웃
  logout = async (req, res) => {
    // const { refreshtoken } = req.headers;
    // const { refreshtoken } = req.cookies;

    let refreshtoken;

    if (req.cookies.refreshtoken) {
      refreshtoken = req.cookies.refreshtoken;
    } else if (req.headers.refreshtoken) {
      refreshtoken = req.headers.refreshtoken;
    } else {
      refreshtoken = null;
    }

    const [tokenType, tokenValue] = refreshtoken.split(' ');
    res.clearCookie();
    await this.userService.logout(tokenValue);
    return res.status(200).end();
  };

  // 로그인 검증 - 테스트용
  authMiddlewareTest = async (req, res, next) => {
    try {
      res.locals.user;

      return res.status(200).send(res.locals.user);
    } catch (err) {
      console.error(err);
    }
  };

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
    const { user_id, location_id } = res.locals.user;
    const { email, nickname, password, user_image } = req.body;
    // let user_image;
    // if (req.img_url) {
    //   user_image = req.img_url.toString();
    // } else {
    //   const profileData = await this.userService.getProfile(user_id);
    //   user_image = profileData.user_image;
    // }

    // 입력받은 값을 userData 객체에 할당
    const userData = {
      user_id,
      nickname,
      email,
      password,
      location_id,
      user_image,
    };

    // 회원정보 수정 처리 결과값 가져오기 (성공: 1, 실패: 0)
    const updateResult = await this.userService.editProfile(userData);

    // 회원정보 수정 처리 후 정보 가져오기
    const getProfileData = await this.userService.getProfile(user_id);

    // 회원정보 수정 결과에 따른 응답 핸들러
    if (!updateResult) {
      return res.status(412).json({ errorMessage: '회원정보 수정 실패' });
    } else {
      return res.status(200).json({ userData: getProfileData });
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
