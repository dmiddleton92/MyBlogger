import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css'; 

const LOGIN_MUTATION = gql`
mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
    token
    user {
        id
        username
    }
    }
}
`;

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [login, { error }] = useMutation(LOGIN_MUTATION);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await login({ variables: { username, password } });
            localStorage.setItem('token', data.login.token);
            navigate('/dashboard');
        } catch (err) {
            console.error('Login error:', err);
        }
    };

    return (
        <div id="login-container">
            <h1 id="login-title">Sign In</h1>
            <form id="login-form" onSubmit={handleSubmit}>
                <input
                    id="login-username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    autoComplete="username"
                />
                <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    autoComplete="current-password"
                />
                <button id="login-submit" type="submit">Sign In</button>
            </form>
            {error && <p id="login-error">{error.message}</p>}
            <p id="login-register-link">
                Don’t have an account? <Link to="/">Register here</Link>
            </p>
        </div>
    );
}

export default Login;