import React from 'react'


import { useSignOut, useIsAuthenticated } from 'react-auth-kit'
import { LinkContainer } from 'react-router-bootstrap'
import { Nav, Navbar, Container, Button } from 'react-bootstrap'

const Navigation = () => {
  const isAuthenticated = useIsAuthenticated()
  const signOut = useSignOut()

  const logout = () => {
    console.log('Logging out')
    signOut()
  }

  return (
    <Navbar bg='light' expand='lg'>
      <Container>
        <Navbar.Brand href="#">A</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className='me-auto'>
            {
              isAuthenticated() && (
                <>
                  <LinkContainer to='/home'>
                    <Nav.Link>Home</Nav.Link>
                  </LinkContainer>
                  <Button variant="outline-alert" onClick={() => logout()}>Logout</Button>
                </>
              )
            }
            {
              !isAuthenticated() && (
                <>
                  <LinkContainer to='/login'>
                    <Nav.Link>Login</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to='/register'>
                    <Nav.Link>Register</Nav.Link>
                  </LinkContainer>
                </>
              )
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Navigation

