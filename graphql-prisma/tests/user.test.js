import '@babel/polyfill';
import 'cross-fetch/polyfill';
import ApolloClient, {
    gql
} from 'apollo-boost';

const client = new ApolloClient({
    uri: "http://localhost:4000"
});

test('Should create new user', async () => {
    const createUser = gql `
        mutation {
        createUser(
            data: { name: "Greg", email: "Greg@example.com", password: "Greg1234" }
        ) {
            token
            user {
            id
            }
        }
        }
    `;

    const response = await client.mutate({
        mutation: createUser
    });


})