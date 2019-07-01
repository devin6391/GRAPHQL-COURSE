const Post = {
  author(parent, args, ctx, info) {
    const { allUsers } = ctx.db;
    return allUsers.find(user => user.id === parent.author);
  },
  comments(parent, args, ctx, info) {
    const { allComments } = ctx.db;
    return allComments.filter(comment => comment.post === parent.id);
  }
};

export default Post;
