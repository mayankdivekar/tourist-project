import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const isHome = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  const linkColor = scrolled || !isHome ? 'var(--text-2)' : 'rgba(255,255,255,0.9)'

  return (
    <nav className={`nav ${scrolled || !isHome ? 'scrolled' : 'nav-transparent'}`}>
      {/* Logo — always goes to home */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 38, height: 38,
          background: 'linear-gradient(135deg, #2E86AB, #F18F01)',
          borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18
        }}>🗺️</div>
        <span style={{
          fontSize: 22, fontWeight: 900,
          fontFamily: 'Playfair Display, serif',
          color: scrolled || !isHome ? 'var(--text)' : 'white'
        }}>TourAI</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <Link to="/" style={{
          padding: '8px 16px', borderRadius: 50, fontSize: 14, fontWeight: 500,
          color: location.pathname === '/' ? 'var(--primary)' : linkColor,
          background: location.pathname === '/' && (scrolled || !isHome) ? 'rgba(46,134,171,0.1)' : 'transparent',
          transition: 'all 0.3s'
        }}>Home</Link>

        <Link to="/explore" style={{
          padding: '8px 16px', borderRadius: 50, fontSize: 14, fontWeight: 500,
          color: location.pathname === '/explore' ? 'var(--primary)' : linkColor,
          background: location.pathname === '/explore' && (scrolled || !isHome) ? 'rgba(46,134,171,0.1)' : 'transparent',
          transition: 'all 0.3s'
        }}>Explore</Link>

        <Link to="/map" style={{
          padding: '8px 16px', borderRadius: 50, fontSize: 14, fontWeight: 500,
          color: location.pathname === '/map' ? 'var(--primary)' : linkColor,
          transition: 'all 0.3s'
        }}>Map</Link>

        {user ? (
          <>
            <Link to="/wishlist" style={{
              padding: '8px 16px', borderRadius: 50, fontSize: 14, fontWeight: 500,
              color: location.pathname === '/wishlist' ? 'var(--primary)' : linkColor,
              transition: 'all 0.3s'
            }}>Wishlist</Link>

            <Link to="/dashboard" className="btn btn-primary" style={{ padding: '8px 22px', fontSize: 13, marginLeft: 8 }}>
             Dashboard
              </Link>
              {user.role === 'admin' && (
              <Link to="/admin" style={{
              padding: '8px 18px', borderRadius: 50, fontSize: 14, fontWeight: 500,
              color: '#F18F01', transition: 'all 0.3s',
              border: '1px solid rgba(241,143,1,0.3)',
               marginLeft: 4
               }}>⚙️ Admin</Link>
                )}

            <button onClick={logout} style={{
              padding: '8px 16px', borderRadius: 50, fontSize: 14, fontWeight: 500,
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: linkColor, fontFamily: 'Inter, sans-serif'
            }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{
              padding: '8px 16px', borderRadius: 50, fontSize: 14, fontWeight: 500,
              color: linkColor, transition: 'all 0.3s'
            }}>Login</Link>

            <Link to="/register" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: 14, marginLeft: 4 }}>
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}