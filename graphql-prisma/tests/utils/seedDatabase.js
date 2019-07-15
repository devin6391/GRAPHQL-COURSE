import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from "../../src/prisma";

export const userOne = {
    input: {
        name: "Abhi",
        email: "sid@rth.com",
        password: bcrypt.hashSync('red12345')
    },
    user: undefined
}

export const postOne = {
    input: {
        title: "Dummy post published",
        body: "...",
        published: true,
    },
    post: undefined
}

export const postTwo = {
    input: {
        title: "Dummy post published",
        body: "...",
        published: false,
    },
    post: undefined
}

const seedDatabase = async () => {
    // Delete test data
    await prisma.mutation.deleteManyPosts();
    await prisma.mutation.deleteManyUsers();

    //Create user one
    userOne.user = await prisma.mutation.createUser({
        data: userOne.input
    });
    userOne.jwt = jwt.sign({
        userId: userOne.user.id
    }, process.env.JWT_SECRET);

    // Create post one
    postOne.post = await prisma.mutation.createPost({
        data: {
            ...postOne.input,
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    });

    // Create post two
    postTwo.post = await prisma.mutation.createPost({
        data: {
            ...postTwo.input,
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    })
}

export default seedDatabase;