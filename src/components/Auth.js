import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';
import './Auth.css';

const url = process.env.REACT_APP_BACKEND_URL;
const accessToken = process.env.REACT_APP_MASTER_KEY;

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const auth = `Basic ${btoa(`${email}:${password}`)}`;

      const response = await axios.post(
        `${url}/auth`,
        { access_token: accessToken },
        {
          headers: {
            Authorization: auth,
          }
        }
      );
      const { token, user } = response.data;

      localStorage.setItem('authToken', token);
      localStorage.setItem('userId', user.id);
      setAuth({ token, user });

      navigate(`/transactions?userId=${user.id}`);
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `${url}/users`,
        { email, password, name, access_token: accessToken }
      );
      setIsRegistering(false);
    } catch (error) {
      console.error('Register error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {loading && <Loading />}
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
            {isRegistering ? 'Already have an account? Login' : 'Don\'t have an account? Register'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
