import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

// Define the GraphQL mutation
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

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [register, { error }] = useMutation(REGISTER_MUTATION); 
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await register({ variables: { username, password } }); 
            localStorage.setItem('token', data.register.token);
            navigate('/'); 
        } catch (err) {
            console.error('Registration error:', err);
        }
    };

    return (
        <div id="register page">
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
            {error && <p>{error.message}</p>}
        </div>
    );
}

export default Register;