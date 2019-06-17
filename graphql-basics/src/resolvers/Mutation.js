import uuidv4 from "uuid/v4";

const Mutation = {
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
  updateUser(parent, args, ctx, info) {
    const { id, data } = args;
    let { allUsers } = ctx.db;

    const user = allUsers.find(user => user.id === id);

    if (!user) {
      throw new Error("User not  found");
    }

    if (typeof data.email === "string") {
      const emailTaken = allUsers.some(user => user.email === data.email);
      if (emailTaken) {
        throw new Error("Email taken");
      }

      user.email = data.email;
    }

    if (typeof data.name === "string") {
      user.name = data.name;
    }

    if (typeof data.age !== "undefined") {
      user.age = data.age;
    }

    return user;
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
  updatePost(parent, args, ctx, info) {
    let { allPosts, allComments, allUsers } = ctx.db;
    const { id, data } = args;
    const { title, body, published } = data;

    const post = allPosts.find(post => post.id === id);

    if (!post) {
      throw new Error("Post not found");
    }

    if (typeof title === "string") {
      post.title = title;
    }

    if (typeof body === "string") {
      post.body = body;
    }

    if (typeof published !== "undefined") {
      post.published = published;
    }

    return post;
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
  },
  updateComment(parent, args, ctx, info) {
    let { allComments } = ctx.db;
    const { id, data } = args;
    const { text } = data;

    const comment = allComments.find(comment => comment.id === id);

    if (!comment) {
      throw new Error("Comment not found");
    }

    if (typeof text === "string") {
      comment.text = text;
    }

    return comment;
  }
};

export default Mutation;
