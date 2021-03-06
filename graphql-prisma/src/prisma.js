import {
    Prisma
} from "prisma-binding";
import {
    fragmentReplacements
} from './resolvers'

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: process.env.PRISMA_ENDPOINT,
    secret: process.env.PRISMA_SECRET,
    fragmentReplacements
});

export default prisma;

// const updatePostForUser = async (postId, data) => {
//     const isPostExist = await prisma.exists.Post({id: postId});

//     if(!isPostExist) {
//         throw new Error(`Post with id ${postId} doesn't exist`);
//     }

//     const updatedPost = await prisma.mutation.updatePost({
//         where: {
//             id: postId
//         },
//         data
//     }, '{ author { name posts { title body published } } }' );

//     return updatedPost.author;
// }

// updatePostForUser("cjxrnaho9001b078175eqo8bx", {
//     title: "First update to first post",
//     body: "The first updation is awesome",
//     published: false
// }).then(user => console.log(JSON.stringify(user, null, 2))).catch(e => console.error(e))