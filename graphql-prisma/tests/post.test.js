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
                    title: "This is a great title"
                }
            ) {
                id
                title
                body
                published
            }
        }
    `;

    const reponse = await client.mutate({
        mutation: updatePost
    });

    // const exists = await prisma.exists.Post({
    //     id: postOne.post.id,
    //     published: false
    // });

    // expect(data.updatePost.published).toBe(false);
    // expect(exists).toBe(true);
})