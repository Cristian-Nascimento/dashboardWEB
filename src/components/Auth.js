import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const url = process.env.REACT_APP_BACKEND_URL;

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const accessToken = process.env.REACT_APP_MASTER_KEY

      const auth = `Basic ${btoa(`${email}:${password}`)}`

      const response = await axios.post(
        `${url}/auth`,
        { access_token: accessToken },
        {
          headers: {
            Authorization: auth
          }
        }
      );
      const { token, user } = response.data;
      let userId = user.id;
      localStorage.setItem('authToken', token);
      localStorage.setItem('userId', userId);
      setAuth({ token, user });

      await axios.get(`${url}/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { userId: userId }
      });

      navigate(`/transactions?userId=${userId}`);
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${url}/users`, { email, password, name });
      setIsRegistering(false);
    } catch (error) {
      console.error('Register error:', error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isRegistering ? 'Register' : 'Welcome'}</h2>
        <form onSubmit={isRegistering ? handleRegister : handleLogin}>
          {isRegistering && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="auth-button">
            {isRegistering ? 'REGISTER' : 'LOGIN'}
          </button>
        </form>
        <div className="toggle-link">
          <button className="toggle-button" onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? 'Already have an account? Login' : 'Dont have an account? Register'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
