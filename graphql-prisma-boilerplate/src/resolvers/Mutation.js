import bcrypt from 'bcryptjs';
import getUserId from '../utils/getUserId';
import generateToken from '../utils/generateToken';
import hashPassword from '../utils/hashPassword';
import generateRandomNumberTillTen from '../utils/generateRandomNumberTillTen';

const Mutation = {
  async createUser(parent, args, ctx, info) {
    const password = await hashPassword(args.data.password);
    const opArgs = {
      ...args.data,
      password
    };

    const user = await ctx.prisma.mutation.createUser({
      data: opArgs
    });

    return {
      user,
      token: generateToken(user.id)
    }
  },
  async login(parent, args, ctx, info) {
    const user = await ctx.prisma.query.user({
      where: {
        email: args.email
      }
    });

    if (!user) {
      throw new Error("User not found");
    }

    const isMatched = await bcrypt.compare(args.password, user.password);

    if (!isMatched) {
      throw new Error("Password not matched");
    }

    return {
      user,
      token: generateToken(user.id)
    }
  },
  deleteUser(parent, args, ctx, info) {
    const userId = getUserId(ctx.request);
    return ctx.prisma.mutation.deleteUser({
      where: {
        id: userId
      },
      info
    });
  },
  async updateUser(parent, args, ctx, info) {
    const userId = getUserId(ctx.request);

    if (typeof args.data.password === 'string') {
      args.data.password = await hashPassword(args.data.password);
    }

    return ctx.prisma.mutation.updateUser({
      where: {
        id: userId
      },
      data: args.data
    }, info)
  }
}

export default Mutation;