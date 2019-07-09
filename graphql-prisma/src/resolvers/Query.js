import getUserId from '../utils/getUserId';

const Query = {
  users(parent, args, ctx, info) {
    const {prisma} = ctx;
    const {query} = args;
    const opArgs = {};

    if(query) {
      opArgs.where = {
        OR: [{
          name_contains: query
        }]
      }
    }

    return prisma.query.users(opArgs, info);
  },
  posts(parent, args, ctx, info) {
    const {prisma} = ctx;
    const {query} = args;
    const opArgs = {
      where: {
        published: true
      }
    };

    if(query) {
      opArgs.where.OR = [{
          title_contains: query
        }, {
          body_contains: query
        }]
    }

    return prisma.query.posts(opArgs, info);
  },
  myPosts(parent, args, ctx, info) {
    const userId = getUserId(ctx.request);
    const {query} = args;
    const opArgs = {
      where: {
        author: {
          id: userId
        }
      }
    };

    if(query) {
      opArgs.where.OR = [{
          title_contains: query
        }, {
          body_contains: query
        }]
    }

    return ctx.prisma.query.posts(opArgs, info);
  },
  comments(parent, args, ctx, info) {
    const {prisma} = ctx;
    const {query} = args;
    const opArgs = {};

    if(query) {
      opArgs.where = {
          text_contains: query
      }
    }

    return prisma.query.comments(opArgs, info);
  },
  async post(parent, args, ctx, info) {
    const userId = getUserId(ctx.request, false);

    const posts = await ctx.prisma.query.posts({
      where: {
        id: args.id,
        OR: [{
          published: true
        }, {
          author: {
            id: userId
          }
        }]
      }
    }, info);

    if(posts.length === 0) {
      throw new Error("Post not found");
    }

    return posts[0];
  },
  me(parent, args, ctx, info) {
    const userId = getUserId(ctx.request);
    return ctx.prisma.query.user({
      where: {
        id: userId
      }
    })
  }
};

export default Query;
