const Query = {
  users(parent, args, ctx, info) {
    const {prisma} = ctx;
    const {query} = args;
    const opArgs = {};

    if(query) {
      opArgs.where = {
        OR: [{
          name_contains: query
        }, {
          email_contains: query
        }]
      }
    }

    return prisma.query.users(opArgs, info);
  },
  posts(parent, args, ctx, info) {
    const {prisma} = ctx;
    const {query} = args;
    const opArgs = {};

    if(query) {
      opArgs.where = {
        OR: [{
          title_contains: query
        }, {
          body_contains: query
        }]
      }
    }

    return prisma.query.posts(opArgs, info);
  },
  comments(parent, args, ctx, info) {
    return ctx.db.allComments;
  }
};

export default Query;
