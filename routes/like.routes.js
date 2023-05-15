const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth-middleware');
const LikesController = require('../controllers/like.controller');
const likesController = new LikesController();

router.get('/like', authMiddleware, likesController.getlikeItem);
router.put('/:items_id/like', authMiddleware, likesController.putlike);

module.exports = router;
