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

const db = {
  allUsers,
  allPosts,
  allComments
};

export default db;
