import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import getUserId from '../utils/getUserId';

const Mutation = {
  async createUser(parent, args, ctx, info) {
    if(args.data.password.length < 8) {
      throw new Error("Password must be 8 characters or longer")
    }

    const password = await bcrypt.hash(args.data.password, 10);
    const opArgs = {...args.data, password};

    const user = await ctx.prisma.mutation.createUser({data: opArgs});

    return {
      user,
      token: jwt.sign({userId: user.id}, 'thisisasecret')
    }
  },
  async login(parent, args, ctx, info) {
    const user = await ctx.prisma.query.user({
      where: {
        email: args.email
      }
    });

    if(!user) {
      throw new Error("User not found");
    }

    const isMatched = await bcrypt.compare(args.password, user.password);

    if(!isMatched) {
      throw new Error("Password not matched");
    }

    return {
      user,
      token: jwt.sign({userId: user.id}, 'thisisasecret')
    }
  },
  deleteUser(parent, args, ctx, info) {
    const userId = getUserId(ctx.request);
    return ctx.prisma.mutation.deleteUser({
      where: {id: userId},
      info
    });
  },
  updateUser(parent, args, ctx, info) {
    const userId = getUserId(ctx.request);

    return ctx.prisma.mutation.updateUser({
      where: {
        id: userId
      },
      data: args.data
    }, info)
  },
  createPost(parent, args, ctx, info) {
    const userId = getUserId(ctx.request);

    const opArgsData = {...args.data};
    opArgsData.author = {
      connect: {
        id: userId
      }
    }
    const opArgs = {data: opArgsData}
    return ctx.prisma.mutation.createPost(opArgs, info);
  },
  async deletePost(parent, args, ctx, info) {
    const userId = getUserId(ctx.request);
    const isPostExist = await ctx.prisma.exists.Post({
      id: args.id,
      author: {
        id: userId
      }
    });

    if(!isPostExist) {
      throw new Error("Unable to delete post");
    }

    return ctx.prisma.mutation.deletePost({where: {id: args.id}}, info);
  },
  async updatePost(parent, args, ctx, info) {
    const userId = getUserId(ctx.request);
    const isPostExist = await ctx.prisma.exists.Post({
      id: args.id,
      author: {
        id: userId
      }
    });

    if(!isPostExist) {
      throw new Error("Unable to update post");
    }

    return ctx.prisma.mutation.updatePost({where: {id: args.id}, data: args.data}, info);
  },
  createComment(parent, args, ctx, info) {
    const userId = getUserId(ctx.request);

    return ctx.prisma.mutation.createComment({
      data: {
        text: args.data.text,
        author: {
          connect: {
            id: userId
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
  async deleteComment(parent, args, ctx, info) {
    const userId = getUserId(ctx.request);
    const isCommentExist = await ctx.prisma.exists.Comment({
      id: args.id,
      author: {
        id: userId
      }

    });

    if(!isCommentExist) {
      throw new Error("Cannot delete comment");
    }

    return ctx.prisma.mutation.deleteComment({
      where: {
        id: args.id
      }
    },info)
  },
  async updateComment(parent, args, ctx, info) {
    const userId = getUserId(ctx.request);
    const isCommentExist = await ctx.prisma.exists.Comment({
      id: args.id,
      author: {
        id: userId
      }
    });

    if(!isCommentExist) {
      throw new Error("Cannot update comment");
    }

    return ctx.prisma.mutation.updateComment({
      where: {
        id: args.id
      },
      data: args.data
    }, info);
  }
};

export default Mutation;
