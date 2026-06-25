import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const submit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/auth/register', form)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data))
      navigate('/onboarding')
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #134e5e, #71b280)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, position: 'relative', overflow: 'hidden'
    }}>
      {/* Floating elements */}
      {['🏔️', '🏖️', '🌿', '🦁', '🛕'].map((emoji, i) => (
        <div key={i} style={{
          position: 'absolute',
          fontSize: `${24 + i * 8}px`,
          top: `${10 + i * 18}%`,
          left: i % 2 === 0 ? `${5 + i * 3}%` : undefined,
          right: i % 2 !== 0 ? `${5 + i * 3}%` : undefined,
          animation: `float ${4 + i}s ease-in-out infinite`,
          animationDelay: `${i * 0.5}s`,
          opacity: 0.4
        }}>{emoji}</div>
      ))}

      <div style={{
        width: '100%', maxWidth: 480,
        background: 'rgba(255,255,255,0.97)',
        borderRadius: 24, padding: '48px 40px',
        boxShadow: '0 30px 80px rgba(0,0,0,0.3)',
        position: 'relative', zIndex: 1,
        animation: 'fadeInUp 0.6s ease forwards'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 64, height: 64,
            background: 'linear-gradient(135deg, #134e5e, #71b280)',
            borderRadius: 16, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: 28, margin: '0 auto 16px'
          }}>✈️</div>
          <h2 style={{
            fontSize: 28, fontWeight: 700,
            fontFamily: 'Playfair Display, serif', marginBottom: 6
          }}>Start Your Journey</h2>
          <p style={{ color: 'var(--text-2)', fontSize: 15 }}>
            Create your account — preferences come next!
          </p>
        </div>

        {error && (
          <div style={{
            background: '#FEE2E2', color: '#B91C1C',
            padding: '12px 16px', borderRadius: 10,
            marginBottom: 20, fontSize: 14
          }}>⚠️ {error}</div>
        )}

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>
              Full Name
            </label>
            <input
              placeholder="Your full name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>
              Email Address
            </label>
            <input
               type="email"
               placeholder="you@example.com"
               value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
               title="Please enter a valid email address"
               required
              />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>
              Password
            </label>
            <input
              type="password"
              placeholder="Min 6 characters"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
              minLength={6}
            />
          </div>

          <button type="submit" className="btn btn-secondary" disabled={loading}
            style={{ width: '100%', justifyContent: 'center', marginTop: 8, padding: '14px' }}>
            {loading ? '⏳ Creating...' : '🌍 Create Account & Set Preferences →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--text-2)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>
            Login →
          </Link>
        </p>
      </div>
    </div>
  )
}