const { Users } = require('../models');
const redis = require('redis');
const RedisClientRepository = require('../repositories/redis.repository.js');
const jwt = require('../utils/jwt.js');

const redisClientRepository = new RedisClientRepository(redis);

// 사용자 인증 미들웨어 - Redis 방식
module.exports = async (req, res, next) => {
  try {
    const { accesstoken, refreshtoken } = req.headers;
    // const { accesstoken, refreshtoken } = req.cookies;

    // 쿠키 존재 유무 체크 : (falsy) 쿠키 토큰이 존재하지 않습니다.
    const isaccesstoken = accesstoken ? true : false;
    const isrefreshtoken = refreshtoken ? true : false;

    if (!isaccesstoken || !isrefreshtoken) {
      return res
        .status(401)
        .json({ errorMessage: '쿠키에 모든 토큰 없음, 로그인 필요' });
    }

    // 쿠키 토큰 타입, 토큰 값 분할 할당
    const [accesstokenType, accesstokenValue] = accesstoken.split(' ');
    const [refreshtokenType, refreshtokenValue] = refreshtoken.split(' ');

    // 쿠키 토큰 타입 확인 : (falsy) 토큰타입이 정상적이지 않습니다.
    const isaccesstokenType = jwt.validateTokenType(accesstokenType);
    const isrefreshtokenType = jwt.validateTokenType(refreshtokenType);

    if (!isaccesstokenType) {
      return res
        .status(402)
        .json({ errorMessage: '엑세스 토큰 타입 불량, 로그인 필요' });
    }

    if (!isrefreshtokenType) {
      return res
        .status(402)
        .json({ errorMessage: '리프레시 토큰 타입 불량, 로그인 필요' });
    }

    // 토큰 값 JWT 검증 : (falsy) 토큰이 만료되었습니다.
    const isrefreshtokenValue = jwt.validateTokenValue(refreshtokenValue);
    const isaccesstokenValue = jwt.validateTokenValue(accesstokenValue);
    let redis_user_id;

    if (isrefreshtokenValue) {
      // redis에 cookie.refreshtoken와 동일한게 있는지 확인
      redis_user_id = await redisClientRepository.getData(refreshtokenValue);
      console.log(redis_user_id);
      if (!redis_user_id) {
        return res.status(403).send('서버에 리프레시 토큰 없음, 재로그인 필요');
      }
    }

    if (!isaccesstokenValue) {
      // Users DB에서 redis_user_id와 같은 회원정보 가져오기
      const userData = await Users.findOne({
        attributes: ['user_id', 'nickname', 'location_id', 'user_image'],
        where: { user_id: redis_user_id },
      });
      // Access Token 새발급
      const newaccesstokenValue = jwt.createaccesstoken(
        userData.dataValues.user_id,
        userData.dataValues.nickname,
        userData.dataValues.location_id,
        userData.dataValues.user_image,
      );
      res.locals.user = jwt.getTokenPayload(newaccesstokenValue);
      res.cookie('accesstoken', `Bearer ${newaccesstokenValue}`);
      res.status(200).json({
        accesstoken: newaccesstokenValue,
        refreshtoken: refreshtokenValue,
      });
    }
    res.locals.user = jwt.getTokenPayload(accesstokenValue);
    next();
  } catch (err) {
    console.error(err);
    return res
      .status(401)
      .json({ errorMessage: '전달된 쿠키에서 오류가 발생하였습니다.' });
  }
};
