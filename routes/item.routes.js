const express = require('express');
const authMiddleware = require('../middlewares/auth-middleware.js');
const WorldcupController = require('../controllers/worldcup.controller');
const worldcupController = new WorldcupController();

// POST: 월드컵 생성
router.post('/', authMiddleware, worldcupController.createWorldcup);

// GET: 월드컵 전체 조회
router.get('/', worldcupController.getAllWorldcups);

// GET: 월드컵 상세 조회
router.get('/:worldcup_id', worldcupController.getOneWorldcup);

// PATCH: 월드컵 수정
router.patch(
  '/:worldcup_id',
  authMiddleware,
  worldcupController.updateWorldcup,
);

// DELETE: 월드컵 삭제
router.delete(
  '/:worldcup_id',
  authMiddleware,
  worldcupController.deleteWorldcup,
);

// POST: 월드컵 결과 저장
router.post(
  '/:worldcup_id/result',
  authMiddleware,
  worldcupController.postWorldcupResult,
);

// GET: 월드컵 결과 조회
router.get(
  '/:worldcup_id/result/:worldcup_choice_id',
  authMiddleware,
  worldcupController.getWorldcupResult,
);

module.exports = router;
