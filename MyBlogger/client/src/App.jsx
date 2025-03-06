import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate, Link } from 'react-router-dom';
import './App.css';

const REGISTER_MUTATION = gql`
  mutation Register($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      token
      user {
        id
        username
        email
      }
    }
  }
`;

function App() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(''); // Added for email field
  const [password, setPassword] = useState('');
  const [register, { error: registerError }] = useMutation(REGISTER_MUTATION);
  const navigate = useNavigate();

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await register({ variables: { username, email, password } });
      localStorage.setItem('token', data.register.token);
      setUsername('');
      setEmail('');
      setPassword('');
      navigate('/login'); // Redirect to sign-in page
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  return (
    <div id="register-page">
      <h1 id="register-header">My Blog</h1>
      <nav id="register-nav">
        <Link to="/login">Sign In</Link>
      </nav>
      <div id="register-content">
        <h2 id="register-title">Register</h2>
        <form id="register-form" onSubmit={handleRegisterSubmit}>
          <input
            id="register-username-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            autoComplete="username"
          />
          <input
            id="register-email-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            autoComplete="email"
          />
          <input
            id="register-password-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="new-password"
          />
          <button id="register-submit-button" type="submit">Register</button>
        </form>
        {registerError && <p id="register-error-message">{registerError.message}</p>}
      </div>
    </div>
  );
}

export default App;