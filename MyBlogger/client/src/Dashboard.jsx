import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import './App.css';


const GET_POSTS = gql`
    query GetPosts {
        posts {
            id
            title
            content
            author {
                id
                username
            }
            date
        }
    }
`;

const CREATE_POST = gql`
    mutation CreatePost($title: String!, $content: String!) {
        createPost(title: $title, content: $content) {
            id
            title
            content
            author {
                id
                username
            }
            date
        }
    }
`;

const DELETE_POST = gql`
    mutation DeletePost($id: ID!) {
        deletePost(id: $id)
    }
`;

function Dashboard() {
    const { loading, error, data } = useQuery(GET_POSTS);
    const [createPost] = useMutation(CREATE_POST, { refetchQueries: [{ query: GET_POSTS }] });
    const [deletePost] = useMutation(DELETE_POST, { refetchQueries: [{ query: GET_POSTS }] });
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createPost({ variables: { title, content } });
            setTitle('');
            setContent('');
        } catch (err) {
            console.error('Post creation error:', err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deletePost({ variables: { id } });
        } catch (err) {
            console.error('Delete error:', err);
        }
    };

    const handleSignOut = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <div id="dashboard-container">
            <h1 id="dashboard-header">My Blog Dashboard</h1>
            <button id="dashboard-signout-button" onClick={handleSignOut}>Sign Out</button>
            <form id="dashboard-create-form" onSubmit={handleSubmit}>
                <input
                    id="dashboard-title-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Post Title"
                />
                <textarea
                    id="dashboard-content-input"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Post Content"
                />
                <button id="dashboard-create-button" type="submit">Create Post</button>
            </form>
            <div id="dashboard-posts-container">
                {loading && <p id="dashboard-loading">Loading posts...</p>}
                {error && <p id="dashboard-error">Error fetching posts: {error.message}</p>}
                {!loading && !error && (!data || !data.posts) && <p id="dashboard-no-data">No data available.</p>}
                {!loading && !error && data && data.posts && data.posts.length === 0 && (
                    <p id="dashboard-no-posts">No posts yet.</p>
                )}
                {!loading && !error && data && data.posts && data.posts.length > 0 && (
                    data.posts.map((post) => (
                        <div id={`dashboard-post-${post.id}`} key={post.id}>
                            <h2 id={`dashboard-post-title-${post.id}`}>{post.title}</h2>
                            <p id={`dashboard-post-content-${post.id}`}>{post.content}</p>
                            <p id={`dashboard-post-meta-${post.id}`}>
                                By {post.author.username} on {new Date(post.date).toLocaleDateString()}
                            </p>
                            <button id={`dashboard-delete-button-${post.id}`} onClick={() => handleDelete(post.id)}>
                                Delete
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Dashboard;
    