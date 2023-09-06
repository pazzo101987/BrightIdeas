import './App.css';
import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import jwtdecode from 'jwt-decode'
import Nav from './components/Nav';
import Dashboard from './components/Dashboard';
import RegLog from './components/RegLog';

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [welcome, setWelcome] = useState()
  const [count, setCount] = useState(0)
  const [user, setUser] = useState()

  const cookieValue = Cookies.get('userToken');

  useEffect(() => {
    setCount(count + 1)
    if (cookieValue) {
      setWelcome(jwtdecode(cookieValue).name + " (@" + jwtdecode(cookieValue).displayName + ")")
      setUser(jwtdecode(cookieValue))
      setLoggedIn(true)
    } else {
      setWelcome("Guest")
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <Nav cookieValue={cookieValue} user={user} setUser={setUser} welcome={welcome} setWelcome={setWelcome} loggedIn={loggedIn} setLoggedIn={setLoggedIn} count={count} setCount={setCount} />
      <ToastContainer transition={Slide} />
      <Routes>
        <Route path="/" element={<RegLog setLoggedIn={setLoggedIn} count={count} setCount={setCount} setWelcome={setWelcome} cookieValue={cookieValue} />} />
        <Route path="/dashboard" element={<Dashboard count={count} setCount={setCount} user={user} welcome={welcome} />} />

      </Routes>
    </div>
  );
}

export default App;
