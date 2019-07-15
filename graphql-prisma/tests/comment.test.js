import "@babel/polyfill";
import "cross-fetch/polyfill";
import seedDatabase, {
    userOne,
    commentOne,
    commentTwo,
    postOne
} from './utils/seedDatabase';
import getClient from './utils/getClient';
import prisma from "../src/prisma";
import {
    deleteComment,
    subscribeToComments
} from './utils/operations';

beforeEach(seedDatabase);

const client = getClient();

test('Should delete own comment', async () => {
    const client = getClient(userOne.jwt);

    const variables = {
        id: commentTwo.comment.id
    }

    await client.mutate({
        mutation: deleteComment,
        variables
    });

    const exists = await prisma.exists.Comment({
        id: commentTwo.comment.id
    })

    expect(exists).toBe(false);
});

test('Shouldn\'t delete own comment', async () => {
    const client = getClient(userOne.jwt);

    const variables = {
        id: commentOne.comment.id
    }

    await expect(client.mutate({
        mutation: deleteComment,
        variables
    })).rejects.toThrow()
});

test('Should subscribe to comments for a post', async (done) => {
    const variables = {
        postId: postOne.post.id
    }

    client.subscribe({
        query: subscribeToComments,
        variables
    }).subscribe({
        next(response) {
            expect(response.data.comment.mutation).toBe("DELETED");
            done();
        }
    });

    await prisma.mutation.deleteComment({
        where: {
            id: commentOne.comment.id
        }
    })
});