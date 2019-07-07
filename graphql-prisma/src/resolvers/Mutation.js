import uuidv4 from "uuid/v4";

const Mutation = {
  createUser(parent, args, ctx, info) {
    return ctx.prisma.mutation.createUser({data: args.data, info});
  },
  deleteUser(parent, args, ctx, info) {
    return ctx.prisma.mutation.deleteUser({where: {id: args.id}, info});
  },
  updateUser(parent, args, ctx, info) {
    return ctx.prisma.mutation.updateUser({
      where: {
        id: args.id
      },
      data: args.data
    }, info)
  },
  createPost(parent, args, ctx, info) {
    const opArgsData = {...args.data};
    delete opArgsData.author;
    opArgsData.author = {
      connect: {
        id: args.data.author
      }
    }
    const opArgs = {data: opArgsData}
    return ctx.prisma.mutation.createPost(opArgs, info);
  },
  deletePost(parent, args, ctx, info) {
    return ctx.prisma.mutation.deletePost({where: {id: args.id}}, info);
  },
  updatePost(parent, args, ctx, info) {
    return ctx.prisma.mutation.updatePost({where: {id: args.id}, data: args.data}, info);
  },
  createComment(parent, args, ctx, info) {
    return ctx.prisma.mutation.createComment({
      data: {
        text: args.data.text,
        author: {
          connect: {
            id: args.data.author
          }
        },
        post: {
          connect: {
            id: args.data.post
          }
        }
      }
    }, info);
  },
  deleteComment(parent, args, ctx, info) {
    return ctx.prisma.mutation.deleteComment({
      where: {
        id: args.id
      }
    },info)
  },
  updateComment(parent, args, ctx, info) {
    return ctx.prisma.mutation.updateComment({
      where: {
        id: args.id
      },
      data: args.data
    }, info);
  }
};

export default Mutation;
