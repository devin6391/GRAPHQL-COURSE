import { GraphQLServer } from "graphql-yoga";
import uuidv4 from "uuid/v4";
import db from "./db";

// Resolvers
const resolvers = {
  Query: {
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
    comments() {
      return ctx.db.allComments;
    }
  },
  Mutation: {
    createUser(parent, args, ctx, info) {
      const { allUsers } = ctx.db;
      const { email } = args.data;
      const emailTaken = allUsers.some(user => user.email === email);

      if (emailTaken) {
        throw new Error("Email taken.");
      }

      const user = {
        id: uuidv4(),
        ...args.data
      };

      allUsers.push(user);

      return user;
    },
    deleteUser(parent, args, ctx, info) {
      let { allPosts, allUsers, allComments } = ctx.db;
      const { id } = args;
      const userIndex = allUsers.findIndex(user => user.id === id);

      if (userIndex === -1) {
        throw new Error("No user found");
      }

      allPosts = allPosts.filter(post => {
        const postFound = post.author === id;

        if (postFound) {
          allComments = allComments.filter(comment => comment.post !== post.id);
        }

        return !postFound;
      });

      allComments = allComments.filter(comment => comment.author !== id);

      const deletedUsers = allUsers.splice(userIndex, 1);

      return deletedUsers[0];
    },
    createPost(parent, args, ctx, info) {
      const { allPosts, allUsers } = ctx.db;
      const { author } = args.data;
      const userExist = allUsers.some(user => user.id === author);

      if (!userExist) {
        throw new Error("User doesn't exist");
      }

      const post = {
        id: uuidv4(),
        ...args.data
      };

      allPosts.push(post);

      return post;
    },
    deletePost(parent, args, ctx, info) {
      let { allPosts, allComments } = ctx.db;
      const { id } = args;

      const postToBeDeleted = allPosts.find(post => post.id === id);

      if (!postToBeDeleted) {
        throw new Error("Post not found");
      }

      allPosts = allPosts.filter(post => post.id !== id);

      allComments = allComments.filter(comment => comment.post !== id);

      return postToBeDeleted;
    },
    createComment(parent, args, ctx, info) {
      const { allPosts, allUsers, allComments } = ctx.db;
      const { author, post } = args.data;

      const userExist = allUsers.some(user => user.id === author);
      const postExist = allPosts.some(
        posta => posta.id === post && posta.published
      );

      if (!userExist) {
        throw new Error("User does not exists");
      }

      if (!postExist) {
        throw new Error("Post doesn't exists");
      }

      const comment = {
        id: uuidv4(),
        ...args.data
      };

      allComments.push(comment);

      return comment;
    },
    deleteComment(parent, args, ctx, info) {
      let { allComments } = ctx.db;
      const { id } = args;
      const commentDeleted = allComments.find(comment => comment.id === id);
      allComments = allComments.filter(comment => comment.id !== id);
      return commentDeleted;
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      const { allUsers } = ctx.db;
      return allUsers.find(user => user.id === parent.author);
    },
    comments(parent, args, ctx, info) {
      const { allComments } = ctx.db;
      return allComments.filter(comment => comment.post === parent.id);
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      const { allPosts } = ctx.db;
      return allPosts.filter(post => post.author === parent.id);
    },
    comments(parent, args, ctx, info) {
      const { allComments } = ctx.db;
      return allComments.filter(comment => comment.author === parent.id);
    }
  },
  Comment: {
    author(parent, args, ctx, info) {
      const { allUsers } = ctx.db;
      return allUsers.find(user => user.id === parent.author);
    },
    post(parent, args, ctx, info) {
      const { allPosts } = ctx.db;
      return allPosts.find(post => post.id === parent.post);
    }
  }
};

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: {
    db
  }
});

server.start(() => {
  console.log("The server is up");
});
