const User = {
  posts(parent, args, ctx, info) {
    const { allPosts } = ctx.db;
    return allPosts.filter(post => post.author === parent.id);
  },
  comments(parent, args, ctx, info) {
    const { allComments } = ctx.db;
    return allComments.filter(comment => comment.author === parent.id);
  }
};

export default User;
