import "@babel/polyfill";
import "cross-fetch/polyfill";
import {
    gql
} from "apollo-boost";
import seedDatabase, {
    userOne,
    postOne
} from './utils/seedDatabase';
import getClient from './utils/getClient';
import prisma from "../src/prisma";

const client = getClient();

beforeEach(seedDatabase);

test('Should see published posts', async () => {
    const getPosts = gql `
        query {
            posts {
                id
                title
                body
                published
            }
        }
    `

    const response = await client.query({
        query: getPosts
    });

    const allPosts = response.data.posts;

    expect(allPosts.length).toBe(1);
    expect(allPosts[0].published).toBe(true);
});

test('Should fetch all the posts of user one', async () => {
    const client = getClient(userOne.jwt);

    const myPostsQuery = gql `
        query {
            myPosts {
                id
                title
                published
            }
        }
    `;

    const {
        data
    } = await client.query({
        query: myPostsQuery
    });

    expect(data.myPosts.length).toBe(2);
});

test('Should update post one', async () => {
    const client = getClient(userOne.jwt);

    const updatePost = gql `
        mutation {
            updatePost(
                id: "${postOne.post.id}",
                data: {
                    published: false
                }
            ) {
                id
                title
                body
                published
            }
        }
    `;

    const {
        data
    } = await client.mutate({
        mutation: updatePost
    });

    const exists = await prisma.exists.Post({
        id: postOne.post.id,
        published: false
    });

    expect(data.updatePost.published).toBe(false);
    expect(exists).toBe(true);
});

test('Should create a new post', async () => {
    const client = getClient(userOne.jwt);

    const createPost = gql `
        mutation {
            createPost(
                data: {
                    title: "Good post",
                    body: "...",
                    published: false
                }
            ) {
                id
                title
                body
                published
            }
        }
    `;

    const {
        data
    } = await client.mutate({
        mutation: createPost
    });

    const exists = await prisma.exists.Post({
        id: data.createPost.id,
        published: false
    });

    expect(exists).toBe(true);
});

test('Should delete post one', async () => {
    const client = getClient(userOne.jwt);

    const deletePost = gql `
        mutation {
            deletePost(
                id: "${postOne.post.id}"
            ) {
                id
            }
        }
    `;

    await client.mutate({
        mutation: deletePost
    });

    const exists = await prisma.exists.Post({
        id: postOne.post.id,
        published: false
    });

    expect(exists).toBe(false);
});