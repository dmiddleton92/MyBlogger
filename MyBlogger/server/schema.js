const { gql } = require('apollo-server-express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);
const blogPostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

const typeDefs = gql`
    type User {
    id: ID!
    username: String!
}
    type AuthPayload {
    token: String!
    user: User!
}
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
    register(username: String!, password: String!): AuthPayload!
    login(username: String!, password: String!): AuthPayload!
    createPost(title: String!, content: String!): BlogPost!
    updatePost(id: ID!, title: String, content: String): BlogPost
    deletePost(id: ID!): Boolean!
}
    `;

const resolvers = {
    Query: {
        posts: async () => await BlogPost.find().populate('author'),
        post: async (_, { id }) => await BlogPost.findById(id).populate('author'),
        me: async (_, __, { user }) => (user ? await User.findById(user.id) : null),
    },
    Mutation: {
        register: async (_, { username, password }) => {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({ username, password: hashedPassword });
            await user.save();
            const token = jwt.sign({ id: user._id }, 'YOUR_SECRET_KEY', { expiresIn: '1h' });
            return { token, user };
        },
        login: async (_, { username, password }) => {
            const user = await User.findOne({ username });
            if (!user || !(await bcrypt.compare(password, user.password))) {
                throw new Error('Invalid credentials');
            }
            return { token, user };
        },
        createPost: async (_, { title, content }, { user }) => {
            if (!user) throw new Error('Authentication required');
            const post = new BlogPost({ title, content, author: user.id });
            return await post.save();
        },
        deletePost: async (_, { id }, { user }) => {
            if (!user) throw new Error('Authentication required');
            const post = await BlogPost.findById(id);
            if (post.author.toString() !== user.id) throw new Error('Not authorized');
            await BlogPost.findByIdAndDelete(id);
            return true;
        },
    },
};


function context({ req }) {
    const token = req.headers.authorization?.replace('Bearer ', '') || '';
    try {
        const decoded = jwt.verify(token, 'YOUR_SECRET_KEY');
        return { user: decoded };
    } catch {
        return { user: null };
    }
}

module.exports = { typeDefs, resolvers, context };