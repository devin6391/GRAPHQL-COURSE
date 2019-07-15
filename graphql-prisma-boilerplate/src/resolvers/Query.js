import getUserId from '../utils/getUserId';

const Query = {
  users(parent, args, ctx, info) {
    const {
      prisma
    } = ctx;
    const {
      query
    } = args;
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy
    };

    if (query) {
      opArgs.where = {
        OR: [{
          name_contains: query
        }]
      }
    }

    return prisma.query.users(opArgs, info);
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