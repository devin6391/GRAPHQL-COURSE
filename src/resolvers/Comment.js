const Comment = {
  author(parent, args, ctx, info) {
    const { allUsers } = ctx.db;
    return allUsers.find(user => user.id === parent.author);
  },
  post(parent, args, ctx, info) {
    const { allPosts } = ctx.db;
    return allPosts.find(post => post.id === parent.post);
  }
};

export default Comment;
