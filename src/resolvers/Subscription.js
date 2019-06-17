const Subscription = {
  comment: {
    subscribe(parent, args, ctx, info) {
      const { pubsub, db } = ctx;
      const { postId } = args;

      const post = db.allPosts.find(post => post.id === postId);

      if (!post) {
        throw new Error("Post not found");
      }

      return pubsub.asyncIterator(`comment_${postId}`);
    }
  },
  post: {
    subscribe(parent, args, ctx, info) {
      const { pubsub } = ctx;

      return pubsub.asyncIterator("post");
    }
  }
};

export default Subscription;
