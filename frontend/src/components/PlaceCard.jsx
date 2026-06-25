import { useState } from 'react'
import { Link } from 'react-router-dom'

const CATEGORY_COLORS = {
  heritage: 'badge-amber', beach: 'badge-ocean', nature: 'badge-green',
  wildlife: 'badge-green', hill: 'badge-blue', adventure: 'badge-red',
  religious: 'badge-purple'
}

const CATEGORY_ICONS = {
  heritage: '🏛️', beach: '🏖️', nature: '🌿',
  wildlife: '🐯', hill: '⛰️', adventure: '🧗', religious: '🛕'
}

export default function PlaceCard({ place, index = 0 }) {
  const [hovered, setHovered] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const method = place.recommendation_info?.method
  const score = place.recommendation_info?.hybrid_score

  const handleMouseMove = e => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12
    setTilt({ x, y })
  }

  const handleMouseLeave = () => {
    setHovered(false)
    setTilt({ x: 0, y: 0 })
  }

  return (
    <Link to={'/place/' + place.id} style={{ display: 'block', height: '100%' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          background: 'white',
          borderRadius: 20,
          overflow: 'hidden',
          height: '100%',
          border: '1px solid var(--border)',
          transition: 'transform 0.15s ease, box-shadow 0.4s ease, border-color 0.4s ease',
          transform: hovered
            ? 'perspective(1000px) rotateX(' + tilt.y + 'deg) rotateY(' + tilt.x + 'deg) translateY(-12px) scale(1.02)'
            : 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)',
          boxShadow: hovered
            ? '0 30px 60px rgba(0,0,0,0.2), 0 0 0 1px rgba(46,134,171,0.2)'
            : '0 2px 8px rgba(0,0,0,0.06)',
          borderColor: hovered ? 'rgba(46,134,171,0.3)' : 'var(--border)',
          cursor: 'pointer'
        }}
      >
        {/* Image */}
        <div style={{ position: 'relative', overflow: 'hidden', height: 220 }}>
          <img
            src={place.image || '/places/taj-mahal.jpg'}
            alt={place.name}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: hovered ? 'scale(1.12)' : 'scale(1)'
            }}
            onError={e => { e.target.src = '/places/taj-mahal.jpg' }}
          />

          {/* Gradient overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: hovered
              ? 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)'
              : 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)',
            transition: 'background 0.4s ease'
          }} />

          {/* Category badge */}
          <div style={{ position: 'absolute', top: 14, left: 14 }}>
            <span className={'badge ' + (CATEGORY_COLORS[place.category] || 'badge-blue')}
              style={{ backdropFilter: 'blur(10px)', background: 'rgba(255,255,255,0.9)' }}>
              {CATEGORY_ICONS[place.category]} {place.category}
            </span>
          </div>

          {/* AI badge */}
          {method && (
            <div style={{ position: 'absolute', top: 14, right: 14 }}>
              <span className={'method-badge ' + (method === 'hybrid' ? 'method-hybrid' : 'method-cold')}
                style={{ backdropFilter: 'blur(10px)' }}>
                🤖 AI
              </span>
            </div>
          )}

          {/* Location */}
          <div style={{
            position: 'absolute', bottom: 14, left: 14,
            color: 'white', fontSize: 13, fontWeight: 500,
            display: 'flex', alignItems: 'center', gap: 4,
            transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
            transition: 'transform 0.4s ease'
          }}>
            📍 {place.city}, {place.state}
          </div>

          {/* Shimmer effect on hover */}
          {hovered && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
              animation: 'shimmer 1.5s infinite'
            }} />
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '20px 20px 16px' }}>
          <h3 style={{
            fontSize: 18, fontWeight: 700,
            fontFamily: 'Playfair Display, serif',
            color: 'var(--text)', lineHeight: 1.3,
            marginBottom: 8,
            transition: 'color 0.3s ease',
            color: hovered ? 'var(--primary)' : 'var(--text)'
          }}>{place.name}</h3>

          <p style={{
            fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
            marginBottom: 14
          }}>{place.description}</p>

          {/* Tags */}
          <div style={{ marginBottom: 14 }}>
            {(place.tags || []).slice(0, 3).map(tag => (
              <span key={tag} className="tag" style={{ fontSize: 11 }}>{'#' + tag}</span>
            ))}
          </div>

          {/* Footer */}
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', paddingTop: 12,
            borderTop: '1px solid var(--border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#F59E0B' }}>
                {'★'.repeat(Math.round(place.avg_rating || 0))}
              </span>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
                {(place.avg_rating || 0).toFixed(1)}
              </span>
              <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
                {'(' + (place.rating_count || 0) + ')'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <span className={'badge ' + (place.budget === 'high' ? 'badge-red' : place.budget === 'medium' ? 'badge-amber' : 'badge-green')}>
                {place.budget === 'high' ? '₹₹₹' : place.budget === 'medium' ? '₹₹' : '₹'}
              </span>
              <span className="badge badge-ocean">{place.best_season}</span>
            </div>
          </div>

          {/* AI Score bar */}
          {score && (
            <div style={{
              marginTop: 12, padding: '8px 12px',
              background: hovered
                ? 'linear-gradient(135deg, rgba(46,134,171,0.12), rgba(241,143,1,0.08))'
                : 'linear-gradient(135deg, rgba(46,134,171,0.06), rgba(241,143,1,0.04))',
              borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10,
              transition: 'background 0.4s ease'
            }}>
              <div style={{
                flex: 1, height: 4, background: 'var(--border)',
                borderRadius: 2, overflow: 'hidden'
              }}>
                <div style={{
                  width: (score * 100) + '%', height: '100%',
                  background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                  borderRadius: 2,
                  transition: 'width 1.5s ease',
                  boxShadow: hovered ? '0 0 8px rgba(46,134,171,0.5)' : 'none'
                }} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', whiteSpace: 'nowrap' }}>
                {(score * 100).toFixed(0) + '% match'}
              </span>
            </div>
          )}

          {/* View details arrow - appears on hover */}
          <div style={{
            marginTop: 12, textAlign: 'center',
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'translateY(0)' : 'translateY(8px)',
            transition: 'all 0.3s ease'
          }}>
            <span style={{
              fontSize: 13, fontWeight: 700,
              color: 'var(--primary)', letterSpacing: 0.5
            }}>
              View Details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}