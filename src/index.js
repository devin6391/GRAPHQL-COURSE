import { GraphQLServer } from "graphql-yoga";
import uuidv4 from "uuid/v4";

let allUsers = [
  {
    id: "1",
    name: "Vineet",
    email: "Vin@eet",
    age: 28
  },
  {
    id: "2",
    name: "Dev",
    email: "De@eet",
    age: 28
  },
  {
    id: "3",
    name: "Deepu",
    email: "Vin@epu"
  }
];

let allPosts = [
  {
    id: "11",
    title: "This is first post",
    body: "",
    published: true,
    author: "1"
  },
  {
    id: "31",
    title: "This is second post",
    published: true,
    author: "3"
  },
  {
    id: "12",
    title: "This is third post",
    body: "This post is related to first post",
    published: false,
    author: "1"
  }
];

let allComments = [
  {
    id: "111",
    text: "Comment 1 first post",
    author: "2",
    post: "11"
  },
  {
    id: "112",
    text: "Comment 2 first post",
    author: "3",
    post: "11"
  },
  {
    id: "311",
    text: "Comment 1 second post",
    author: "1",
    post: "31"
  },
  {
    id: "312",
    text: "Comment 2 second post",
    author: "3",
    post: "31"
  },
  {
    id: "121",
    text: "Comment 1 third post",
    author: "2",
    post: "12"
  },
  {
    id: "122",
    text: "Comment 2 third post",
    author: "1",
    post: "12"
  }
];

// TYpe defs (schema)
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        comments: [Comment!]!
    }

    type Mutation {
      createUser(data: CreateUserInput!): User!
      deleteUser(id: ID!): User!
      createPost(data: CreatePostInput!): Post!
      deletePost(id: ID!): Post!
      createComment(data: CreateCommentInput!): Comment!
      deleteComment(id: ID!): Comment!
    }

    input CreateUserInput {
      name: String!
      email: String!
      age: Int
    }

    input CreatePostInput {
      title: String!
      body: String!
      published: Boolean!
      author: ID!
    }

    input CreateCommentInput {
      text: String!
      author: ID!
      post: ID!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post]!
        comments: [Comment]!
    }

    type Post {
        id: ID!
        title: String!
        body: String
        published: Boolean!
        author: User!
        comments: [Comment]!
    }

    type Comment {
      id: ID!
      text: String!
      author: User!
      post: Post!
    }
`;

// Resolvers
const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      if (!args.query) {
        return allUsers;
      }
      return allUsers.filter(user =>
        user.name.toLowerCase().includes(args.query.toLowerCase())
      );
    },
    posts(parent, args, ctx, info) {
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
      return allComments;
    }
  },
  Mutation: {
    createUser(parent, args, ctx, info) {
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
      const { id } = args;
      const commentDeleted = allComments.find(comment => comment.id === id);
      allComments = allComments.filter(comment => comment.id !== id);
      return commentDeleted;
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      return allUsers.find(user => user.id === parent.author);
    },
    comments(parent, args, ctx, info) {
      return allComments.filter(comment => comment.post === parent.id);
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return allPosts.filter(post => post.author === parent.id);
    },
    comments(parent, args, ctx, info) {
      return allComments.filter(comment => comment.author === parent.id);
    }
  },
  Comment: {
    author(parent, args, ctx, info) {
      return allUsers.find(user => user.id === parent.author);
    },
    post(parent, args, ctx, info) {
      return allPosts.find(post => post.id === parent.post);
    }
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => {
  console.log("The server is up");
});
