import bcrypt from 'bcryptjs';
import getUserId from '../utils/getUserId';
import generateToken from '../utils/generateToken';
import hashPassword from '../utils/hashPassword';
import generateRandomNumberTillTen from '../utils/generateRandomNumberTillTen';
import {
  promises
} from 'fs';

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
  },
  createPost(parent, args, ctx, info) {
    const userId = getUserId(ctx.request);

    const opArgsData = {
      ...args.data
    };
    opArgsData.author = {
      connect: {
        id: userId
      }
    }
    const opArgs = {
      data: opArgsData
    }
    return ctx.prisma.mutation.createPost(opArgs, info);
  },
  async createManyPosts(parent, args, ctx, info) {
    const {
      prisma,
      request
    } = ctx;
    const userId = getUserId(request);

    const user = await prisma.query.user({
      where: {
        id: userId
      }
    });

    const noOfPosts = generateRandomNumberTillTen();

    const postPromises = [];

    for (let i = 0; i < noOfPosts; i++) {
      const title = `Random post number ${i + 1} created by user '${user.name}' at ${Date.now()}`;
      const body = 'This is a random post';
      const published = Math.random() >= 0.5;
      const opArgsData = {
        title,
        body,
        published,
        author: {
          connect: {
            id: userId
          }
        }
      }
      postPromises.push(prisma.mutation.createPost({
        data: opArgsData
      }, info));
    }

    return Promise.all(postPromises);
  },
  async deletePost(parent, args, ctx, info) {
    const userId = getUserId(ctx.request);
    const isPostExist = await ctx.prisma.exists.Post({
      id: args.id,
      author: {
        id: userId
      }
    });

    if (!isPostExist) {
      throw new Error("Unable to delete post");
    }

    return ctx.prisma.mutation.deletePost({
      where: {
        id: args.id
      }
    }, info);
  },
  async deleteManyPosts(parent, args, ctx, info) {
    const userId = getUserId(ctx.request);
    const ids = args.ids;
    const postPromises = [];
    ids.forEach(async id => {
      const isPostExist = await ctx.prisma.exists.Post({
        id: id,
        author: {
          id: userId
        }
      });

      if (!isPostExist) {
        throw new Error("Unable to delete a post");
      }

      postPromises.push(ctx.prisma.mutation.deletePost({
        where: {
          id: id
        }
      }, info));
    })

    return Promise.all(postPromises);
  },
  async updatePost(parent, args, ctx, info) {
    const userId = getUserId(ctx.request);

    const isPostExist = await ctx.prisma.exists.Post({
      id: args.id,
      author: {
        id: userId
      }
    });

    if (!isPostExist) {
      throw new Error("Unable to update post");
    }

    const isPublished = await prisma.exists.Post({
      id: args.id,
      published: true
    })
    if (isPublished && typeof args.data.published !== "undefined" && !args.data.published) {
      await ctx.prisma.mutation.deleteManyComments({
        where: {
          post: {
            id: args.id
          }
        }
      })
    }

    return ctx.prisma.mutation.updatePost({
      where: {
        id: args.id
      },
      data: args.data
    }, info);
  },
  async createComment(parent, args, ctx, info) {
    const userId = getUserId(ctx.request);

    const isPostPublished = await ctx.prisma.exists.Post({
      id: args.data.post,
      published: true
    });

    if (!isPostPublished) {
      throw new Error("Post not found");
    }

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
  async createManyComments(parent, args, ctx, info) {
    const {
      prisma,
      request
    } = ctx;

    const userId = getUserId(ctx.request);
    const user = await prisma.query.user({
      where: {
        id: userId
      }
    });

    const opArgsPost = {
      where: {
        published: true
      }
    };

    const allPosts = await prisma.query.posts(opArgsPost, info);

    const commentPromises = [];
    const commonOpArgsData = {
      author: {
        connect: {
          id: userId
        }
      }
    }

    allPosts.forEach(post => {
      const commonOpArgsData2 = {
        ...commonOpArgsData,
        post: {
          connect: {
            id: post.id
          }
        }
      }
      const noOfComments = generateRandomNumberTillTen();

      for (let i = 0; i < noOfComments; i++) {
        const text = `This is comment no ${i + 1} for post ${post.id} created by '${user.name}' at ${Date.now()}`;
        const data = {
          ...commonOpArgsData2,
          text
        }
        commentPromises.push(
          prisma.mutation.createComment({
            data
          }, info)
        )
      }
    });

    return Promise.all(commentPromises);
  },
  async deleteComment(parent, args, ctx, info) {
    const userId = getUserId(ctx.request);
    const isCommentExist = await ctx.prisma.exists.Comment({
      id: args.id,
      author: {
        id: userId
      }
    });

    if (!isCommentExist) {
      throw new Error("Cannot delete comment");
    }

    return ctx.prisma.mutation.deleteComment({
      where: {
        id: args.id
      }
    }, info)
  },
  async deleteManyComments(parent, args, ctx, info) {
    const userId = getUserId(ctx.request);
    const ids = args.ids;

    const commnetPromises = []
    ids.forEach(async id => {
      const isCommentExist = await ctx.prisma.exists.Comment({
        id: id,
        author: {
          id: userId
        }
      });

      if (!isCommentExist) {
        throw new Error("Cannot delete comment");
      }

      commnetPromises.push(ctx.prisma.mutation.deleteComment({
        where: {
          id: id
        }
      }, info));
    });

    return Promise.all(commnetPromises);
  },
  deleteAllComments(parent, args, ctx, info) {
    const userId = getUserId(ctx.request);

    return ctx.prisma.mutation.deleteManyComments({
      where: {
        author: {
          id: userId
        }
      }
    });
  },
  async updateComment(parent, args, ctx, info) {
    const userId = getUserId(ctx.request);
    const isCommentExist = await ctx.prisma.exists.Comment({
      id: args.id,
      author: {
        id: userId
      }
    });

    if (!isCommentExist) {
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