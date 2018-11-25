const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const { createStore } = require('./utils');

const LaunchAPI = require('./datasources/launch');
const UserAPI = require('./datasources/user');
const resolvers = require('./resolvers');

const store = createStore();

const server = new ApolloServer({
    context : async ({req}) =>  {
        const auth = req.headers && req.headers.authorization || '';
        const email =  new Buffer(auth, 'base64').toString('ascii');
        if (!isEmail.validate(email)) return { user: null}
        //find a user by their email
        const users = await store.users.findOrCreate({where: {email} });
        const user = users || users[0]? users[0]: null
        return {user: {...user.dataValues}}

    },
     typeDefs,
     resolvers,
     dataSources : () => ({
        launchAPI : new LaunchAPI(),
        UserAPI : new UserAPI({store}),
     })
    });

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});