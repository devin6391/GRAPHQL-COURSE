import "@babel/polyfill";
import "cross-fetch/polyfill";
import seedDatabase, {
    userOne,
    postOne,
    postTwo
} from './utils/seedDatabase';
import getClient from './utils/getClient';
import prisma from "../src/prisma";
import {
    getPosts,
    myPostsQuery,
    updatePost,
    createPost,
    deletePost
} from './utils/operations';

const client = getClient();

beforeEach(seedDatabase);

test('Should see published posts', async () => {
    const response = await client.query({
        query: getPosts
    });

    const allPosts = response.data.posts;

    expect(allPosts.length).toBe(1);
    expect(allPosts[0].published).toBe(true);
});

test('Should fetch all the posts of user one', async () => {
    const client = getClient(userOne.jwt);

    const {
        data
    } = await client.query({
        query: myPostsQuery
    });

    expect(data.myPosts.length).toBe(2);
});

test('Should update post one', async () => {
    const client = getClient(userOne.jwt);

    const variables = {
        id: postOne.post.id,
        data: {
            published: false
        }
    }

    const {
        data
    } = await client.mutate({
        mutation: updatePost,
        variables
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

    const variables = {
        data: {
            title: "Good post",
            body: "...",
            published: false
        }
    }

    const {
        data
    } = await client.mutate({
        mutation: createPost,
        variables
    });

    const exists = await prisma.exists.Post({
        id: data.createPost.id,
        published: false
    });

    expect(exists).toBe(true);
});

test('Should delete post two', async () => {
    const client = getClient(userOne.jwt);

    const variables = {
        id: postTwo.post.id
    }

    await client.mutate({
        mutation: deletePost,
        variables
    });

    const exists = await prisma.exists.Post({
        id: postTwo.post.id
    });

    expect(exists).toBe(false);
});