import React from 'react'

import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from 'react-auth-kit'

import './App.css';

import AppRoutes from './router'
import Navigation from './components/navigation';

function App() {
  return (
    <div className="App">
      <AuthProvider authType='localstorage' authName='_auth'>
        <BrowserRouter>
          <Navigation/>
          <AppRoutes/>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
