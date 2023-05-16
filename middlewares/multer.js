// module import
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');

// 환경 변수 설정
require('dotenv').config();

// AWS-S3 설정
// - AWS-SDK를 사용하여 S3 클라이언트를 생성
// - 환경변수의 REGION, ACCESS_KEY_ID, SECRET_ACCESS_KEY 사용
const s3 = new aws.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// 허용할 확장자 배열
const allowedExtensions = ['.png', '.jpg', '.jpeg', '.bmp', '.gif'];

// 이미지 업로드 설정
const uploadImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'ddanggeun9', // AWS버킷명
    contentType: multerS3.AUTO_CONTENT_TYPE, // 타입 자동감지
    fileFilter: (req, file, callback) => {
      // 파일 필터링 로직
      // 업로드된 파일이 없는 경우 null 반환
      if (!file) {
        return callback(null, false);
      }
      // 파일 허용
      callback(null, true);
    },
    key: (req, file, callback) => {
      // 파일 키 생성 로직
      // 날짜 추출하여 각 변수명으로 분할 할당
      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth() + 1;
      const currentDate = today.getDate();
      const currentHour = today.getHours();
      const currentMinute = today.getMinutes();
      const currentSecond = today.getSeconds();
      const date = `${currentYear}-${currentMonth}-${currentDate}-${currentHour}-${currentMinute}-${currentSecond}`;

      // 4자리 랜덤숫자 생성
      let randomNumber = '';
      for (let i = 0; i < 4; i++) {
        randomNumber += String(Math.floor(Math.random() * 10));
      }

      // 업로드된 파일의 확장자 추출 -> 소문자로 변환
      const extension = path.extname(file.originalname).toLowerCase();

      // 추출된 확장자가 허용 확장자 목록에 포함하지 않으면
      // 에러를 콜백함수로 전달
      if (!allowedExtensions.includes(extension)) {
        const error = new Error('확장자 에러');
        return callback(error);
        // return callback(new Error('확장자 에러'));
      }

      // 업로드된 이미지의 url 생성
      const photo_ip = `https://ddanggeun9.s3.ap-northeast-2.amazonaws.com/folder/${date}_${randomNumber}`;

      // req.img_url 배열이 없을 경우, 빈 배열로 초기화
      if (!req.img_url) {
        req.img_url = [];
      }

      // req.img_url 배열에 업로드된 이미지의 URL인 photo_ip 추가
      req.img_url.push(photo_ip);

      // 콜백 함수를 호출하여 파일 키 전달
      // 이렇게 생성된 파일 키는 S3 버킷에 저장될 파일의 경로 및 이름을 나타냄
      // ex) folder/2023-05-16-10-30-45_1234
      // callback 첫번째 매개변수 : 에러
      // callback 두번째 매개변수 : 생성된 파일 키
      callback(null, `folder/${date}_${randomNumber}`);
    },
    acl: 'public-read',
  }),
  limits: {
    fileSize: 25 * 1024 * 1024,
  },
});

module.exports = uploadImage;
