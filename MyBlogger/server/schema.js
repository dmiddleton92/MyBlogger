const { gql } = require('apollo-server-express');
const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema;)

const typeDefs = gql`
    type BlogPost {
        id: ID!
        title: String!
        content: String!
        author: String!
        date: String!
}
type Query {
    posts: [BlogPost!]!
    post(id: ID!): BlogPost
}

type Mutation {
    createPost(title: String!, content: String!, author: String!): BlogPost!
    updatePost(id: ID!, title: String, content: String, author: String): BlogPost
    deletePost(id: ID!): Boolean!
}
    `;

    const resolvers = {
        Query: {
            posts: async () => await BlogPost.find(),
            post: async (_, { id }) => await BlogPost.findById(id),
        },
        Mutation: {
            createPost: async (_, { title, content, author }) => {
                const post = new BlogPost({ title, content, author });
                return await post.save();
            },
            updatePost: async (_, { id, title, content, author }) => {
                const updates = {};
                if (title) updates.title = title;
                if (content) updates.content = content;
                if (author) updates.author = author;
                return await BlogPost.findByIdAndUpdate(id, updates, { new: true });    
            },
            deletePost: async (_, { id }) => {
                await BlogPost.findByIdAndDelete(id);
                return true;
            }
        }   
    };  

    module.exports = { typeDefs, resolvers };