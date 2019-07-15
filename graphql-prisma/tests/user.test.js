import "@babel/polyfill";
import "cross-fetch/polyfill";
import prisma from "../src/prisma";
import seedDatabase, {
    userOne
} from './utils/seedDatabase';
import getClient from './utils/getClient';
import {
    createUser,
    getUsers,
    login,
    getProfile
} from './utils/operations';

const client = getClient();

beforeEach(seedDatabase);

test("Should create new user", async () => {
    const variables = {
        data: {
            name: "Dipu",
            email: "dipu@example.com",
            password: "Dipu1234"
        }
    }

    const response = await client.mutate({
        mutation: createUser,
        variables
    });

    const exists = await prisma.exists.User({
        id: response.data.createUser.user.id
    });

    expect(exists).toBe(true);
});

test('Should expose public author profiles', async () => {
    const response = await client.query({
        query: getUsers
    });

    expect(response.data.users.length).toBe(1);
    expect(response.data.users[0].email).toBe(null);
    expect(response.data.users[0].name).toBe("Abhi");
});

test('Should not login wiht bad credentials', async () => {
    const variables = {
        email: "sid@rth.com",
        password: "asdfasdfasdf"
    }

    await expect(
        client.mutate({
            mutation: login,
            variables
        })
    ).rejects.toThrow()
});

test('Should not signup with short password', async () => {
    const variables = {
        data: {
            name: "Greg",
            email: "Greg@example.com",
            password: "wers123"
        }
    }

    await expect(
        client.mutate({
            mutation: createUser,
            variables
        })
    ).rejects.toThrow()
});

test('Should fetch user profile', async () => {
    const client = getClient(userOne.jwt);

    const {
        data
    } = await client.query({
        query: getProfile
    });

    expect(data.me.id).toBe(userOne.user.id);
    expect(data.me.name).toBe(userOne.user.name);
    expect(data.me.email).toBe(userOne.user.email);
})