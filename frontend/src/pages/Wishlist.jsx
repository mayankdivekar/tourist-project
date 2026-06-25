import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PlaceCard from '../components/PlaceCard'
import api from '../api'

export default function Wishlist() {
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/places/user/wishlist')
      .then(r => { setPlaces(r.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div style={{ paddingTop: 70, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #2E86AB 0%, #F18F01 100%)',
        padding: '60px 20px 40px'
      }}>
        <div className="container">
          <div className="section-tag" style={{
            background: 'rgba(255,255,255,0.2)',
            color: 'white', marginBottom: 16
          }}>📌 Saved</div>
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(32px, 5vw, 52px)',
            color: 'white', fontWeight: 700, marginBottom: 12
          }}>My Wishlist</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16 }}>
            {places.length} places saved • Used as signals by the AI engine
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px' }}>
        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 28
          }}>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 380, borderRadius: 16 }} />
            ))}
          </div>
        ) : places.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: 80, marginBottom: 24 }}>📌</div>
            <h2 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 28, marginBottom: 12
            }}>Your wishlist is empty</h2>
            <p style={{ color: 'var(--text-2)', marginBottom: 32, fontSize: 16 }}>
              Save places you love and our AI will use them to find similar destinations!
            </p>
            <Link to="/explore" className="btn btn-primary" style={{ fontSize: 16, padding: '14px 32px' }}>
              🌍 Explore Places
            </Link>
          </div>
        ) : (
          <>
            {/* AI Signal info */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(46,134,171,0.08), rgba(241,143,1,0.08))',
              border: '1px solid rgba(46,134,171,0.2)',
              borderRadius: 16, padding: '16px 24px',
              marginBottom: 32,
              display: 'flex', alignItems: 'center', gap: 12
            }}>
              <span style={{ fontSize: 24 }}>🤖</span>
              <p style={{ fontSize: 14, color: 'var(--text-2)' }}>
                Your wishlist is actively used by our AI recommendation engine as behavioral signals
                to find more places you'll love!
              </p>
            </div>
            <div className="grid-3">
              {places.map((p, i) => <PlaceCard key={p.id} place={p} index={i} />)}
            </div>
          </>
        )}
      </div>
    </div>
  )
}