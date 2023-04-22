import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { useSignIn } from 'react-auth-kit';

import { register } from '../../api/auth';

const Register = () => {
  const signIn = useSignIn()
  const navigate = useNavigate()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const { token, ...user } = await register(email, password)

      console.log('Registration successful!');
      if (signIn({ token, tokenType: 'Bearer', authState: user, expiresIn: 500000 })) {
        console.log('Signed IN')
        setTimeout(() => {
          navigate('/home')
        }, 500)
      } else {
        console.log('NOT SIGNED IN')
      }
    } catch (error) {
      console.log('Registration failed!');
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
              onChange={(event) => setEmail(event.target.value)} />
          </div>
          <div className='form-group mb-3'>
            <input className='form-control'
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)} />
          </div>
          <button className='btn btn-primary' type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
