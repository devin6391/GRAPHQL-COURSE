const Query = {
  users(parent, args, ctx, info) {
    const { allUsers } = ctx.db;
    if (!args.query) {
      return allUsers;
    }
    return allUsers.filter(user =>
      user.name.toLowerCase().includes(args.query.toLowerCase())
    );
  },
  posts(parent, args, ctx, info) {
    const { allPosts } = ctx.db;
    const { query } = args;
    if (!query) {
      return allPosts;
    }
    return allPosts.filter(
      post =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        (post.body && post.body.toLowerCase().includes(query.toLowerCase()))
    );
  },
  comments(parent, args, ctx, info) {
    return ctx.db.allComments;
  }
};

export default Query;
