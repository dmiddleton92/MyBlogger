import { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import './App.css';

const GET_POSTS = gql`
  query {
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

const REGISTER_MUTATION = gql`
  mutation Register($username: String!, $password: String!) {
    register(username: $username, password: $password) {
      token
      user {
        id
        username
      }
    }
  }
`;

const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id)
  }
`;

function App() {
  const { loading, error, data } = useQuery(GET_POSTS);
  const [createPost] = useMutation(CREATE_POST, { refetchQueries: [{ query: GET_POSTS }] });
  const [deletePost] = useMutation(DELETE_POST, { refetchQueries: [{ query: GET_POSTS }] });
  const [register, { error: registerError }] = useMutation(REGISTER_MUTATION);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState(''); 

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

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await register({ variables: { username, password } });
      localStorage.setItem('token', data.register.token);
      setUsername('');
      setPassword('');
      alert('Registered successfully! Please log in.');
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePost({ variables: { id } });
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div id="My-Blog">
      <h1>My Blog</h1>
      <nav>
        <Link to="/login">Login</Link>
      </nav>

      {/* Registration Form */}
      <div>
        <h2>Register</h2>
        <form onSubmit={handleRegisterSubmit}>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)} // Fixed to setUsername
            placeholder="Username"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button type="submit">Register</button>
        </form>
        {registerError && <p>{registerError.message}</p>}
      </div>

      {/* Post Creation Form */}
      <form onSubmit={handleSubmit}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" />
        <button type="submit">Create Post</button>
      </form>

      {/* Post List */}
      {loading && <p>Loading posts...</p>}
      {error && <p>Error fetching posts: {error.message}</p>}
      {!loading && !error && (!data || !data.posts) && <p>No data available.</p>}
      {!loading && !error && data && data.posts && data.posts.length === 0 && <p>No posts yet.</p>}
      {!loading && !error && data && data.posts && data.posts.length > 0 && (
        data.posts.map((post) => (
          <div key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <p>by {post.author.username}</p>
            <p>{new Date(post.date).toLocaleDateString()}</p>
            <button onClick={() => handleDelete(post.id)}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
}

export default App;