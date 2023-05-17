const redis = require('redis');
const jwt = require('../utils/jwt.js');
const { Users } = require('../models');
const AppError = require('../utils/appError');
const UserRepository = require('../repositories/user.repository');
const RedisClientRepository = require('../repositories/redis.repository.js');
const getLocationName = require('../utils/location.util.js');

const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

require('dotenv').config();
var appDir = path.dirname(require.main.filename);

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

  // 이메일 인증
  senduserMail = async (email, userNum) => {
    try {
      let emailTemplete = await new Promise((resolve, reject) => {
        // 이메일 템플릿 파일 렌더링
        ejs.renderFile(
          appDir + '/utils/mail.ejs', // 경로생성
          { userCode: userNum }, // 생성 번호 전달
          function (err, data) {
            if (err) {
              reject(err);
            }
            resolve(data);
          },
        );
      });

      // 이메일 전송 객체 생성
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // TLS 암호화사용 off
        auth: {
          user: process.env.NODEMAILER_USER,
          pass: process.env.NODEMAILER_PASS,
        },
        // tls: {
        //   rejectUnauthorized: false,
        // },
      });

      // 이메일 전송
      let mailOptions = {
        from: `DDANGGEUN99 <${process.env.NODEMAILER_USER}>`,
        to: email,
        subject: '인증번호 확인 메일입니다', // email 제목
        html: emailTemplete,
      };

      // 전송결과
      await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.error(error);
            reject(error);
          } else {
            console.log(`${email}주소로 인증 메일을 보냈습니다.`);
            transporter.close();
            resolve();
          }
        });
      });
    } catch (error) {
      console.error(error);
      throw new AppError(500, '이메일 전송 중 오류가 발생하였습니다.');
    }

    // redis에 인증번호 저장
    redisClient.set(email, userNum, 'EX', 600); // 10분 동안 유효
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
      const accesstoken = jwt.createaccesstoken(
        user.user_id,
        user.nickname,
        user.location_id,
        user.user_image,
      );
      const refreshtoken = jwt.createrefreshtoken(user.user_id);

      // redis 저장 준비
      const key = refreshtoken;
      const value = user.user_id;
      // const value = JSON.stringify({
      //   user_id: user.user_id,
      //   nickname: user.nickname,
      //   location_id: user.location_id,
      //   user_image: user.user_image,
      // });

      // REDIS 저장 실행
      const EXPIRE_TIME = 1209600; // 14일로 셋팅
      await this.redisClientRepository.setData(key, value, EXPIRE_TIME);
      return [accesstoken, refreshtoken];
    } catch (err) {
      console.error(err);
    }
  };

  // 로그아웃
  logout = async (refreshtoken) => {
    try {
      const result = await this.redisClientRepository.delData(refreshtoken);
      console.log(result);
      return result;
    } catch (err) {
      console.error(err);
    }
  };

  // 회원정보 조회
  getProfile = async (user_id) => {
    try {
      const getProfileData = await this.userRepository.getProfile(user_id);
      const setProfileData = {
        user_id: getProfileData.user_id,
        nickname: getProfileData.nickname,
        email: getProfileData.email,
        location_name: getLocationName(getProfileData.dataValues.location_id),
        user_image: getProfileData.user_image,
      };
      return setProfileData;
    } catch (err) {
      console.error(err);
    }
  };

  // 회원정보 수정
  editProfile = async (userData) => {
    try {
      return await this.userRepository.editProfile(userData);
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
