import { GraphQLServer } from "graphql-yoga";
import addFunc from "./math";

const allComments = [
  {
    id: "a",
    text: "Comment 1 first post",
    author: "553",
    post: "1"
  },
  {
    id: "b",
    text: "Comment 2 first post",
    author: "189",
    post: "1"
  },
  {
    id: "c",
    text: "Comment 1 second post",
    author: "123",
    post: "2"
  },
  {
    id: "d",
    text: "Comment 2 second post",
    author: "553",
    post: "2"
  },
  {
    id: "e",
    text: "Comment 1 third post",
    author: "553",
    post: "3"
  },
  {
    id: "f",
    text: "Comment 2 third post",
    author: "189",
    post: "3"
  }
];

const allUsers = [
  {
    id: "123",
    name: "Vineet",
    email: "Vin@eet",
    age: 28
  },
  {
    id: "553",
    name: "Dev",
    email: "De@eet",
    age: 28
  },
  {
    id: "189",
    name: "Deepu",
    email: "Vin@epu"
  }
];

const allPosts = [
  {
    id: "1",
    title: "This is first post",
    body: "",
    published: true,
    author: "123"
  },
  {
    id: "2",
    title: "This is second post",
    published: true,
    author: "189"
  },
  {
    id: "3",
    title: "This is third post",
    body: "This post is related to first post",
    published: false,
    author: "123"
  }
];

// TYpe defs (schema)
const typeDefs = `
    type Query {
        me: User!
        post: Post!
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        comments: [Comment!]!
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
    me() {
      return {
        id: "abc123",
        name: "Vinett",
        email: "vin@dev",
        age: 28
      };
    },
    post() {
      return {
        id: "234@12",
        title: "First post",
        published: false
      };
    },
    comments() {
      return allComments;
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
