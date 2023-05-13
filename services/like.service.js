const LikeRepository = require('../repositories/likes.repository');
const PostRepository = require('../repositories/posts.repository');
const AppError = require('../utils/appError');

class PostService {
  likeRepository = new LikeRepository();
  postRepository = new PostRepository();

  putlike = async (post_id, user_id) => {
    const post = await this.postRepository.findOne(post_id);
    if (!post) {
      throw new AppError(404, '판매글이 존재하지 않습니다.');
    }

    const like = await this.likeRepository.findOne(post_id, user_id);
    if (like) {
      await this.likeRepository.destroy(post_id, user_id);
      return '내 관심목록에서 삭제되었습니다.';
    } else {
      await this.likeRepository.create(post_id, user_id);
      return '내 관심목록에 등록되었습니다.';
    }
  };

  getlikePost = async (user_id) => {
    return await this.likeRepository.findlikePost(user_id);
  };
}

module.exports = PostService;
