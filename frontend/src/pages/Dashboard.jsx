import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PlaceCard from '../components/PlaceCard'
import api from '../api'

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/recommendations')
      .then(r => { setRecommendations(r.data); setLoading(false) })
      .catch(() => { setError('Could not load recommendations. Make sure ML engine is running.'); setLoading(false) })
  }, [])

  const info = recommendations[0]?.recommendation_info

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(160deg, #050d1a 0%, #0a1628 40%, #0f2035 100%)',
        padding: '120px 20px 80px',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `linear-gradient(rgba(46,134,171,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(46,134,171,0.05) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)'
        }} />
        <div style={{
          position: 'absolute', width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(241,143,1,0.08) 0%, transparent 65%)',
          top: '-30%', right: '-10%', pointerEvents: 'none',
          animation: 'orbFloat 12s ease-in-out infinite'
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 8, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600 }}>
                Welcome back
              </p>
              <h1 style={{
                fontSize: 'clamp(32px, 5vw, 56px)',
                fontFamily: 'Playfair Display, serif',
                color: 'white', fontWeight: 700,
                marginBottom: 16, letterSpacing: '-1px'
              }}>{user.name} 👋</h1>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {(user.preferred_categories || []).map(cat => (
                  <span key={cat} style={{
                    background: 'rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: 'rgba(255,255,255,0.8)',
                    padding: '5px 16px', borderRadius: 50,
                    fontSize: 12, fontWeight: 600, letterSpacing: '0.5px'
                  }}>{cat}</span>
                ))}
              </div>
            </div>
            <Link to="/explore" className="btn btn-ghost">
              🌍 Explore More
            </Link>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px' }}>
        {/* AI Engine Card */}
        {info && (
          <div style={{
            background: 'white', borderRadius: 24,
            padding: 32, marginBottom: 48,
            border: '1px solid var(--border)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
            marginTop: -40, position: 'relative', zIndex: 2
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
              <div style={{
                width: 48, height: 48,
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                borderRadius: 14, display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: 22
              }}>🤖</div>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 2 }}>AI Recommendation Engine</h3>
                <p style={{ fontSize: 13, color: 'var(--text-3)' }}>How your results were generated today</p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
              {[
                { label: 'Method', value: info.method === 'hybrid' ? '🔀 Hybrid AI' : '📄 Content-Based', bg: '#EDE9FE', color: '#5B21B6' },
                { label: 'CBF Weight α', value: (info.alpha * 100).toFixed(0) + '%', bg: '#DBEAFE', color: '#1E40AF' },
                { label: 'CF Weight β', value: ((1 - info.alpha) * 100).toFixed(0) + '%', bg: '#DCFCE7', color: '#15803D' },
                { label: 'Status', value: info.alpha > 0.6 ? '🆕 Cold Start' : '✅ Learning', bg: info.alpha > 0.6 ? '#FEF3C7' : '#DCFCE7', color: info.alpha > 0.6 ? '#B45309' : '#15803D' },
              ].map(item => (
                <div key={item.label} style={{ background: item.bg, borderRadius: 14, padding: '16px 20px' }}>
                  <p style={{ fontSize: 11, color: 'var(--text-2)', marginBottom: 6, fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{item.label}</p>
                  <p style={{ fontSize: 17, fontWeight: 700, color: item.color }}>{item.value}</p>
                </div>
              ))}
            </div>
            {info.alpha > 0.6 && (
              <div style={{
                marginTop: 20, padding: '14px 18px',
                background: 'linear-gradient(135deg, rgba(241,143,1,0.08), rgba(241,143,1,0.04))',
                border: '1px solid rgba(241,143,1,0.2)',
                borderRadius: 12, fontSize: 13, color: '#92400E',
                display: 'flex', alignItems: 'center', gap: 10
              }}>
                💡 Rate more places to unlock Collaborative Filtering for even smarter recommendations!
              </div>
            )}
          </div>
        )}

        {/* Recommendations */}
        <div style={{ marginBottom: 40 }}>
          <div className="section-tag">🎯 Personalized For You</div>
          <h2 className="section-title">Your Recommendations</h2>
          <p className="section-sub">Powered by Hybrid CBF + Collaborative Filtering</p>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: 56, marginBottom: 20, animation: 'float 2s ease-in-out infinite' }}>🤖</div>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, marginBottom: 8, color: 'var(--text)' }}>
              AI generating your recommendations...
            </h3>
            <p style={{ color: 'var(--text-3)', fontSize: 15 }}>Analyzing your preferences with our hybrid engine</p>
          </div>
        )}

        {error && (
          <div style={{
            background: '#FEE2E2', color: '#B91C1C',
            padding: 24, borderRadius: 16, border: '1px solid #FECACA', fontSize: 15
          }}>
            ⚠️ {error}
          </div>
        )}

        <div className="grid-3">
          {recommendations.map((p, i) => <PlaceCard key={p.id} place={p} index={i} />)}
        </div>

        {!loading && recommendations.length === 0 && !error && (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: 72, marginBottom: 24 }}>🗺️</div>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, marginBottom: 12 }}>No recommendations yet</h3>
            <p style={{ color: 'var(--text-2)', marginBottom: 32, fontSize: 16 }}>Explore places, rate them, and our AI will learn your taste!</p>
            <Link to="/explore" className="btn btn-primary" style={{ fontSize: 16, padding: '14px 36px' }}>🌍 Start Exploring</Link>
          </div>
        )}
      </div>
    </div>
  )
}