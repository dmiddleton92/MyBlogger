const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { expressMiddleware } = require('@apollo/server-express');
const { typeDefs, resolvers } = require('./schema');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
.then(() => console.log('Connected to MongoDB'));
.catch(err => console.error(err));

const server = new ApolloServer({ typeDefs, resolvers });

async function startServer() {
    await server.start();
app.use(express.json());
app.use('/graphql', server.getMiddleware());
app.listen({ port: 4000 }, () =>
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
);
}

startServer();