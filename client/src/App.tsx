import React from 'react'

import { Container as ModalContainer } from 'react-modal-promise'

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
        <ModalContainer/>
      </AuthProvider>
    </div>
  );
}

export default App;
