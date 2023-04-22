import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthUser, useIsAuthenticated } from 'react-auth-kit'


import Welcome from './pages/welcome/welcome.page'
import Home from './pages/home/home.page'
import Login from './pages/auth/login.page'
import Register from './pages/auth/register.page'
import Error from './pages/error/error.page'

const PrivateRoute = ({ Component }: { Component: () => JSX.Element }) => {
  const isAuthenticated = useIsAuthenticated();
  const auth = isAuthenticated();
  const user = useAuthUser()()
  return auth && user ? <Component /> : <Navigate to="/login" />; 
}



function AppRoutes() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Welcome/>}></Route>
        <Route path="/home" element={<PrivateRoute Component={Home}/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
            path="/error/unauthorized"
            element={<Error status={401} message="Unauthorized request" />}
        />
        <Route
          path="/error/notfound"
          element={<Error status={404} message="Page not found" />}
        />
        <Route path="*" element={<Navigate to="/error/notfound" replace />} />
      </Routes>
    </div>
  )
}

export default AppRoutes
