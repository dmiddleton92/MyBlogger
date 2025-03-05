import { useState } from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'
import { Link } from 'react-router-dom'
import Register from './Register.jsx'
import './App.css'

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
  const { loading, error, data } = useQuery(GET_POSTS)
  const [createPost] = useMutation(CREATE_POST, { refetchQueries: [{ query: GET_POSTS }] })
  const [deletePost] = useMutation(DELETE_POST, { refetchQueries: [{ query: GET_POSTS }] })
  const [register, { error: registerError }] = useMutation(REGISTER_MUTATION);
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault();
    createPost({ variables: { title, content } });
    setTitle('');
    setContent('');
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
  return (
    <div id="My-Blog">
      <h1>My Blog</h1>
      <nav>
        <Link to="/login">Login</Link>
      </nav>
      <div> <h2>Register</h2>
        <form onSubmit={handleRegisterSubmit}>
          <input
            value={username}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button type="submit">Register</button>
        </form>
        {registerError && <p>{registerError.message}</p>}
      </div>

      <form onSubmit={handleSubmit}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" />
        <button type="submit">Create Post</button>
      </form>

      {data.posts.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <p>by {post.author.username}</p>
          <p>{post.date}</p>
          <button onClick={() => deletePost({ variables: { id: post.id } })}>Delete</button>
        </div>
      ))}
    </div>
  );
}
export default App;
