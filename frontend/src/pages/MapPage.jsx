import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Link } from 'react-router-dom'
import api from '../api'

const CATEGORY_ICONS = {
  all: '🌍', beach: '🏖️', heritage: '🏛️', hill: '⛰️',
  wildlife: '🐯', adventure: '🧗', religious: '🛕', nature: '🌿'
}

export default function MapPage() {
  const [places, setPlaces] = useState([])
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    api.get('/places', { params: { limit: 50 } }).then(r => setPlaces(r.data))
  }, [])

  const filtered = filter === 'all' ? places : places.filter(p => p.category === filter)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(160deg, #050d1a 0%, #0a1628 40%, #0f2035 100%)',
        padding: '100px 20px 32px',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `linear-gradient(rgba(46,134,171,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(46,134,171,0.05) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)'
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(32px, 5vw, 52px)',
            color: 'white', fontWeight: 700,
            marginBottom: 8, letterSpacing: '-1px'
          }}>🗺️ India's Tourist Map</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 24, fontWeight: 300 }}>
            {filtered.length} destinations across India
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['all', 'beach', 'heritage', 'hill', 'wildlife', 'adventure', 'religious', 'nature'].map(c => (
              <button key={c} onClick={() => setFilter(c)} style={{
                padding: '7px 18px', borderRadius: 50,
                border: '1px solid rgba(255,255,255,0.2)',
                background: filter === c ? 'rgba(241,143,1,0.9)' : 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(10px)',
                color: filter === c ? 'white' : 'rgba(255,255,255,0.7)',
                cursor: 'none', fontSize: 13, fontWeight: 600,
                fontFamily: 'Space Grotesk, sans-serif',
                transition: 'all 0.3s',
                letterSpacing: '0.3px'
              }}>
                {CATEGORY_ICONS[c]} {c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', height: 'calc(100vh - 220px)' }}>
        {/* Map */}
        <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />
          {filtered.filter(p => p.lat && p.lng).map(p => (
            <Marker key={p.id} position={[p.lat, p.lng]} eventHandlers={{ click: () => setSelected(p) }}>
              <Popup>
                <div style={{ minWidth: 200, fontFamily: 'Space Grotesk, sans-serif' }}>
                  <img
                    src={p.image} alt={p.name}
                    style={{ width: '100%', height: 110, objectFit: 'cover', borderRadius: 10, marginBottom: 10 }}
                    onError={e => e.target.style.display = 'none'}
                  />
                  <strong style={{ fontSize: 15, fontFamily: 'Playfair Display, serif' }}>{p.name}</strong><br />
                  <span style={{ fontSize: 12, color: '#666' }}>📍 {p.city}, {p.state}</span><br />
                  <span style={{ fontSize: 12, color: '#F59E0B' }}>{'★'.repeat(Math.round(p.avg_rating || 0))} {(p.avg_rating || 0).toFixed(1)}</span><br />
                  <Link to={'/place/' + p.id} style={{ color: '#2E86AB', fontSize: 12, fontWeight: 700, marginTop: 6, display: 'inline-block' }}>
                    View Details →
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Sidebar */}
        <div style={{ overflowY: 'auto', background: 'white', borderLeft: '1px solid var(--border)' }}>
          <div style={{
            padding: '20px 20px 16px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--surface-2)',
            position: 'sticky', top: 0, zIndex: 10
          }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, marginBottom: 2 }}>
              Destinations
            </h3>
            <p style={{ fontSize: 12, color: 'var(--text-3)' }}>{filtered.length} places</p>
          </div>

          {filtered.map(p => (
            <div key={p.id} onClick={() => setSelected(p)} style={{
              display: 'flex', gap: 14, padding: '16px 20px',
              borderBottom: '1px solid var(--border)',
              cursor: 'none', transition: 'background 0.2s',
              background: selected?.id === p.id ? 'rgba(46,134,171,0.06)' : 'white',
              borderLeft: selected?.id === p.id ? '3px solid var(--primary)' : '3px solid transparent'
            }}
              onMouseEnter={e => { if (selected?.id !== p.id) e.currentTarget.style.background = 'var(--surface-2)' }}
              onMouseLeave={e => { if (selected?.id !== p.id) e.currentTarget.style.background = 'white' }}
            >
              <img
                src={p.image} alt={p.name}
                style={{ width: 68, height: 68, objectFit: 'cover', borderRadius: 12, flexShrink: 0 }}
                onError={e => e.target.src = '/places/taj-mahal.jpg'}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 3, color: selected?.id === p.id ? 'var(--primary)' : 'var(--text)', fontFamily: 'Playfair Display, serif' }}>
                  {p.name}
                </p>
                <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 6 }}>📍 {p.city}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: '#F59E0B' }}>{'★'.repeat(Math.round(p.avg_rating || 0))}</span>
                  <Link to={'/place/' + p.id} onClick={e => e.stopPropagation()} style={{
                    fontSize: 11, color: 'var(--primary)', fontWeight: 700,
                    padding: '3px 10px', borderRadius: 20,
                    background: 'rgba(46,134,171,0.1)'
                  }}>View →</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}