import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import LoginPage from './auth/Login'
import LoginSuccess from './pages/LoginSuccess'
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home></Home>}></Route>
          <Route path="/login" element={<LoginPage></LoginPage>}></Route>
          <Route path="/login-success" element={<LoginSuccess></LoginSuccess>}></Route>
        </Routes> 
      </Router>
    </>
  )
}

export default App
