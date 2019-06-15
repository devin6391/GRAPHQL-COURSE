import { GraphQLServer } from "graphql-yoga";
import uuidv4 from "uuid/v4";

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
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        comments: [Comment!]!
    }

    type Mutation {
      createUser(name: String!, email: String!, age: Int): User!
      createPost(title: String!, body: String!, published: Boolean!, author: ID!): Post!
      createComment(text: String!, author: ID!, post: ID!): Comment!
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
      const { name, email, age } = args;
      const emailTaken = allUsers.some(user => user.email === email);

      if (emailTaken) {
        throw new Error("Email taken.");
      }

      const user = {
        id: uuidv4(),
        name,
        age,
        email
      };

      allUsers.push(user);

      return user;
    },
    createPost(parent, args, ctx, info) {
      const { author, title, body, published } = args;
      const userExist = allUsers.some(user => user.id === author);

      if (!userExist) {
        throw new Error("User doesn't exist");
      }

      const post = {
        id: uuidv4(),
        title,
        body,
        published,
        author
      };

      allPosts.push(post);

      return post;
    },
    createComment(parent, args, ctx, info) {
      const { text, author, post } = args;

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
        text,
        author,
        post
      };

      allComments.push(comment);

      return comment;
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
