import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import PlaceDetail from './pages/PlaceDetail'
import Explore from './pages/Explore'
import Wishlist from './pages/Wishlist'
import MapPage from './pages/MapPage'
import AdminDashboard from './pages/AdminDashboard'

function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [follower, setFollower] = useState({ x: 0, y: 0 })
  const [hovering, setHovering] = useState(false)
  const [clicking, setClicking] = useState(false)

  useEffect(() => {
    let mouseX = 0, mouseY = 0
    let followerX = 0, followerY = 0
    let animFrame

    const move = e => {
      mouseX = e.clientX
      mouseY = e.clientY
      setPos({ x: mouseX, y: mouseY })
    }

    const animate = () => {
      followerX += (mouseX - followerX) * 0.1
      followerY += (mouseY - followerY) * 0.1
      setFollower({ x: followerX, y: followerY })
      animFrame = requestAnimationFrame(animate)
    }

    const onMouseDown = () => setClicking(true)
    const onMouseUp = () => setClicking(false)

    const addHover = () => setHovering(true)
    const removeHover = () => setHovering(false)

    document.addEventListener('mousemove', move)
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mouseup', onMouseUp)

    const attachHoverListeners = () => {
      document.querySelectorAll('a, button, .btn, .card, .chip, input, textarea').forEach(el => {
        el.addEventListener('mouseenter', addHover)
        el.addEventListener('mouseleave', removeHover)
      })
    }

    attachHoverListeners()
    const interval = setInterval(attachHoverListeners, 1000)
    animFrame = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', move)
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mouseup', onMouseUp)
      cancelAnimationFrame(animFrame)
      clearInterval(interval)
    }
  }, [])

  return (
    <>
      {/* Dot cursor */}
      <div style={{
        position: 'fixed',
        left: pos.x, top: pos.y,
        width: clicking ? 8 : 10,
        height: clicking ? 8 : 10,
        background: 'white',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 99999,
        mixBlendMode: 'difference',
        transition: 'width 0.2s, height 0.2s'
      }} />
      {/* Follower ring */}
      <div style={{
        position: 'fixed',
        left: follower.x, top: follower.y,
        width: hovering ? 52 : clicking ? 28 : 36,
        height: hovering ? 52 : clicking ? 28 : 36,
        border: hovering ? '2px solid #F18F01' : '1.5px solid rgba(255,255,255,0.7)',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 99998,
        mixBlendMode: 'difference',
        transition: 'width 0.3s ease, height 0.3s ease, border 0.3s ease',
        background: hovering ? 'rgba(241,143,1,0.08)' : 'transparent'
      }} />
    </>
  )
}

function PrivateRoute({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <BrowserRouter>
      <CustomCursor />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/onboarding" element={<PrivateRoute><Onboarding /></PrivateRoute>} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/place/:id" element={<PlaceDetail />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/wishlist" element={<PrivateRoute><Wishlist /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />     
      </Routes>
    </BrowserRouter>
  )
}