const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { typeDefs, resolvers, context } = require('./schema');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Debug: Verify environment variables (optional, can remove after confirmation)
console.log('MONGO_URI:', process.env.MONGO_URI);

const app = express();

// Connect to MongoDB (removed deprecated options)
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

const server = new ApolloServer({ typeDefs, resolvers, context });

async function startServer() {
    await server.start();
    app.use(cors());
    app.use(express.json());
    app.use('/graphql', expressMiddleware(server));
    app.listen(4000, () => console.log('Server running at http://localhost:4000/graphql'));
}

startServer();