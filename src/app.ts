import mongoose from 'mongoose';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import typeDefs from './graphql/schema';
import resolvers from './graphql/resolvers/index';

mongoose.set("strictQuery",false)
mongoose.connect('mongodb://localhost:27017/devbook').then(() => {
    console.log("MESSAGES.DB_SUCCESS")
}).catch((err) => {
    console.log("MESSAGES.DB_ERROR, err")
})

const server = new ApolloServer({ typeDefs, resolvers });
startStandaloneServer(server, {
  context: async ({ req }) => ({ token: req.headers.authorization }),
  listen: { port: 4000 }
})
  