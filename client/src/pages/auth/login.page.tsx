import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { useSignIn } from 'react-auth-kit';
import { login } from '../../api/auth';

const Login = () => {
  const signIn = useSignIn()
  const navigate = useNavigate()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const { token, user } = await login(email, password);
  
      if (signIn({ token, tokenType: 'Bearer', authState: user, expiresIn: 500000 })) {
  
        setTimeout(() => {
          navigate('/home')
        }, 500)
      } else {
        alert('Error signing in')
      }
    } catch (error) {
      console.error('Login failed!', error);
      alert('Error signing in')
    }
  };

  return (
    <div className='row mt-5'>
      <div className='col-4 offset-4'>
        <form onSubmit={handleSubmit}>
          <div className='form-group mb-3'>
            <input className='form-control'
              type="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className='form-group mb-3'>
            <input className='form-control'
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <button className='btn btn-primary' type="submit">Login</button>
        </form>
      </div>
    </div>
  )
}

export default Login
