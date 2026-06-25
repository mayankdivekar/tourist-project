import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import PlaceCard from '../components/PlaceCard'
import api from '../api'

const CATEGORIES = ['all', 'beach', 'heritage', 'hill', 'wildlife', 'adventure', 'religious', 'nature']
const BUDGETS = ['all', 'low', 'medium', 'high']
const CATEGORY_ICONS = {
  all: '🌍', beach: '🏖️', heritage: '🏛️', hill: '⛰️',
  wildlife: '🐯', adventure: '🧗', religious: '🛕', nature: '🌿'
}

export default function Explore() {
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('all')
  const [budget, setBudget] = useState('all')
  const [search, setSearch] = useState('')
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const s = searchParams.get('search')
    if (s) setSearch(s)
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = { limit: 50 }
    if (category !== 'all') params.category = category
    if (budget !== 'all') params.budget = budget
    if (search) params.search = search
    api.get('/places', { params })
      .then(r => { setPlaces(r.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [category, budget, search])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(160deg, #050d1a 0%, #0a1628 40%, #0f2035 100%)',
        padding: '120px 20px 60px',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `linear-gradient(rgba(46,134,171,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(46,134,171,0.05) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)'
        }} />
        <div style={{
          position: 'absolute', width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(46,134,171,0.12) 0%, transparent 65%)',
          top: '-20%', right: '-10%', pointerEvents: 'none'
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="section-tag" style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.8)', marginBottom: 16 }}>
            🌍 Discover
          </div>
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(36px, 6vw, 64px)',
            color: 'white', fontWeight: 700,
            marginBottom: 12, letterSpacing: '-1px', lineHeight: 1.1
          }}>
            Explore India
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, fontWeight: 300 }}>
            {places.length} destinations waiting for you
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px' }}>
        {/* Filter card */}
        <div style={{
          background: 'white', borderRadius: 24,
          padding: 32, marginBottom: 40,
          boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
          border: '1px solid var(--border)',
          marginTop: -30, position: 'relative', zIndex: 2
        }}>
          {/* Search */}
          <div style={{ position: 'relative', marginBottom: 28 }}>
            <span style={{
              position: 'absolute', left: 20, top: '50%',
              transform: 'translateY(-50%)', fontSize: 18, zIndex: 1
            }}>🔍</span>
            <input
              placeholder="Search places, tags, descriptions..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                paddingLeft: 52, fontSize: 16,
                border: '2px solid var(--border)',
                borderRadius: 50, padding: '16px 20px 16px 52px',
                fontFamily: 'Space Grotesk, sans-serif'
              }}
            />
          </div>

          {/* Category */}
          <div style={{ marginBottom: 20 }}>
            <p style={{
              fontSize: 11, fontWeight: 700, color: 'var(--text-3)',
              textTransform: 'uppercase', letterSpacing: 2, marginBottom: 14
            }}>Category</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {CATEGORIES.map(c => (
                <button key={c} className={'chip ' + (category === c ? 'active' : '')}
                  onClick={() => setCategory(c)}>
                  {CATEGORY_ICONS[c]} {c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div>
            <p style={{
              fontSize: 11, fontWeight: 700, color: 'var(--text-3)',
              textTransform: 'uppercase', letterSpacing: 2, marginBottom: 14
            }}>Budget</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {BUDGETS.map(b => (
                <button key={b} className={'chip ' + (budget === b ? 'active' : '')}
                  onClick={() => setBudget(b)}>
                  {b === 'all' ? '💰 All' : b === 'low' ? '₹ Budget' : b === 'medium' ? '₹₹ Mid-range' : '₹₹₹ Premium'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 28 }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 420, animationDelay: i * 0.1 + 's' }} />
            ))}
          </div>
        ) : places.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: 72, marginBottom: 20 }}>🔍</div>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, marginBottom: 12 }}>No places found</h3>
            <p style={{ color: 'var(--text-2)', fontSize: 16 }}>Try a different search or filter</p>
          </div>
        ) : (
          <div className="grid-3">
            {places.map((p, i) => <PlaceCard key={p.id} place={p} index={i} />)}
          </div>
        )}
      </div>
    </div>
  )
}