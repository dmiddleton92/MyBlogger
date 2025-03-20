const express = require('express');
const { graghqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const schema = require('./schema/schema');
const resolvers = require('./resolvers/resolvers');

const app = express();

//middleware
app.use(express.json());

//graphql Endpoint

app.use(
    '/graphql',
    graghqlHTTP({
        schema,
        rootValue: resolvers,
        graphiql: true,
    })
);

//connect to mongodb
mongoose
    .connect(process.env.MONGO_URI,
    .then (() => console.log('Connected to MongoDB'))
    .catch((err) => console.log(err));

//start server

const port = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));