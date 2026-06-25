import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const submit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/auth/login', form)
     localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data))
      if (res.data.role === 'admin') {
      navigate('/admin')
    } else {
     navigate('/dashboard')
    }
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, position: 'relative', overflow: 'hidden'
    }}>
      {/* Animated background circles */}
      {[...Array(5)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: `${200 + i * 100}px`,
          height: `${200 + i * 100}px`,
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.05)',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          animation: `pulse-glow ${3 + i}s ease-in-out infinite`,
        }} />
      ))}

      <div style={{
        width: '100%', maxWidth: 460,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: 24,
        padding: '48px 40px',
        boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
        position: 'relative', zIndex: 1,
        animation: 'fadeInUp 0.6s ease forwards'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 64, height: 64,
            background: 'linear-gradient(135deg, #2E86AB, #F18F01)',
            borderRadius: 16, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: 28, margin: '0 auto 16px'
          }}>🗺️</div>
          <h2 style={{
            fontSize: 28, fontWeight: 700,
            fontFamily: 'Playfair Display, serif',
            marginBottom: 6
          }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-2)', fontSize: 15 }}>
            Your next adventure awaits
          </p>
        </div>

        {error && (
          <div style={{
            background: '#FEE2E2', color: '#B91C1C',
            padding: '12px 16px', borderRadius: 10,
            marginBottom: 20, fontSize: 14,
            border: '1px solid #FECACA',
            display: 'flex', alignItems: 'center', gap: 8
          }}>⚠️ {error}</div>
        )}

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}
            style={{ width: '100%', justifyContent: 'center', marginTop: 8, padding: '14px' }}>
            {loading ? '✈️ Logging in...' : '🚀 Login to TourAI'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--text-2)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>
            Create one free →
          </Link>
        </p>

        <div style={{
          marginTop: 20, padding: '12px 16px',
          background: 'var(--surface-2)', borderRadius: 10,
          fontSize: 12, color: 'var(--text-3)', textAlign: 'center'
        }}>
          Demo: admin@tourist.com / admin123
        </div>
      </div>
    </div>
  )
}