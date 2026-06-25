import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import PlaceCard from '../components/PlaceCard'
import api from '../api'

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible')
      }),
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
      .forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}


function TypewriterText({ texts }) {
  const [currentText, setCurrentText] = useState('')
  const [textIndex, setTextIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = texts[textIndex]
    const timeout = setTimeout(() => {
      if (!deleting) {
        if (charIndex < current.length) {
          setCurrentText(current.slice(0, charIndex + 1))
          setCharIndex(c => c + 1)
        } else {
          setTimeout(() => setDeleting(true), 2000)
        }
      } else {
        if (charIndex > 0) {
          setCurrentText(current.slice(0, charIndex - 1))
          setCharIndex(c => c - 1)
        } else {
          setDeleting(false)
          setTextIndex(i => (i + 1) % texts.length)
        }
      }
    }, deleting ? 40 : 90)
    return () => clearTimeout(timeout)
  }, [charIndex, deleting, textIndex, texts])

  return (
    <span>
      <span style={{ color: '#F18F01' }}>{currentText}</span>
      <span style={{
        borderRight: '3px solid #F18F01',
        marginLeft: 2,
        animation: 'blink 1s step-end infinite'
      }} />
    </span>
  )
}

function AnimatedLetters({ text, delay = 0 }) {
  return (
    <span style={{ display: 'inline-block', perspective: '400px' }}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="letter"
          style={{
            animationDelay: (delay + i * 0.04) + 's',
            display: char === ' ' ? 'inline' : 'inline-block'
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  )
}

export default function Home() {
  const [trending, setTrending] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [scrollY, setScrollY] = useState(0)
  const [heroLoaded, setHeroLoaded] = useState(false)
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  useScrollReveal()

  useEffect(() => {
    api.get('/recommendations/trending')
      .then(r => { setTrending(r.data); setLoading(false) })
      .catch(() => setLoading(false))

    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })

    setTimeout(() => setHeroLoaded(true), 100)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = e => {
    e.preventDefault()
    if (searchQuery.trim()) window.location.href = '/explore?search=' + searchQuery
  }

  return (
    <div>
      

      {/* Noise texture overlay */}
      <div className="noise" />

      {/* ===== HERO ===== */}
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #050d1a 0%, #0a1628 25%, #0f2035 55%, #071520 100%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
        padding: '120px 20px 80px'
      }}>

        {/* Animated grid background */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: `
            linear-gradient(rgba(46,134,171,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(46,134,171,0.06) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          animation: 'gridMove 8s linear infinite',
          maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 80%)'
        }} />

        {/* Large color orbs */}
        <div style={{
          position: 'absolute', width: 800, height: 800, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(46,134,171,0.12) 0%, transparent 65%)',
          top: '-20%', left: '-15%',
          animation: 'orbFloat 12s ease-in-out infinite', pointerEvents: 'none', zIndex: 0
        }} />
        <div style={{
          position: 'absolute', width: 700, height: 700, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(241,143,1,0.08) 0%, transparent 65%)',
          bottom: '-20%', right: '-15%',
          animation: 'orbFloat 15s ease-in-out infinite reverse', pointerEvents: 'none', zIndex: 0
        }} />
        <div style={{
          position: 'absolute', width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,158,74,0.07) 0%, transparent 65%)',
          top: '30%', right: '10%',
          animation: 'orbFloat 18s ease-in-out infinite 3s', pointerEvents: 'none', zIndex: 0
        }} />

        {/* Floating destination emojis with parallax */}
        {[
          { e: '🏔️', top: '10%', left: '5%', size: 52, speed: 0.4, delay: 0 },
          { e: '🏖️', top: '75%', left: '3%', size: 40, speed: 0.6, delay: 1 },
          { e: '🌿', top: '15%', right: '5%', size: 46, speed: 0.3, delay: 1.5 },
          { e: '🐯', top: '70%', right: '4%', size: 44, speed: 0.5, delay: 0.5 },
          { e: '🛕', top: '45%', left: '1.5%', size: 36, speed: 0.7, delay: 2 },
          { e: '✈️', top: '25%', right: '1.5%', size: 38, speed: 0.35, delay: 0.8 },
          { e: '🦚', top: '58%', left: '7%', size: 32, speed: 0.5, delay: 2.5 },
          { e: '🌊', top: '88%', right: '10%', size: 34, speed: 0.25, delay: 1.2 },
          { e: '🏯', top: '35%', left: '9%', size: 28, speed: 0.45, delay: 3 },
          { e: '🌺', top: '60%', right: '8%', size: 30, speed: 0.55, delay: 0.3 },
        ].map((item, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: item.top, left: item.left, right: item.right,
            fontSize: item.size, zIndex: 1,
            animation: 'float ' + (6 + i * 0.5) + 's ease-in-out infinite',
            animationDelay: item.delay + 's',
            opacity: heroLoaded ? 0.45 : 0,
            transform: 'translateY(' + (scrollY * item.speed * -0.08) + 'px)',
            transition: 'opacity 1s ease ' + (i * 0.1) + 's, transform 0.05s linear',
            filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.4))'
          }}>{item.e}</div>
        ))}

        {/* Hero content */}
        <div style={{
          textAlign: 'center', maxWidth: 900,
          position: 'relative', zIndex: 2
        }}>
          {/* Live badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 50, padding: '10px 28px',
            fontSize: 11, color: 'rgba(255,255,255,0.8)',
            fontWeight: 700, letterSpacing: 2,
            marginBottom: 40, textTransform: 'uppercase',
            opacity: heroLoaded ? 1 : 0,
            transform: heroLoaded ? 'translateY(0)' : 'translateY(-20px)',
            transition: 'all 0.8s ease'
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%', background: '#4ade80',
              display: 'inline-block', animation: 'glowPulse 2s ease infinite',
              boxShadow: '0 0 12px #4ade80'
            }} />
            AI-Powered • Hybrid Recommendation Engine • Live
          </div>

          {/* Main headline */}
          <h1 style={{
            fontSize: 'clamp(48px, 8vw, 96px)',
            fontWeight: 900, fontFamily: 'Playfair Display, serif',
            color: 'white', lineHeight: 1.0,
            marginBottom: 8, letterSpacing: '-2px'
          }}>
            {heroLoaded && <AnimatedLetters text="Discover" delay={0.3} />}
            <br />
            <span style={{ fontStyle: 'italic', fontSize: '0.85em', color: 'rgba(255,255,255,0.9)' }}>
              {heroLoaded && <AnimatedLetters text="India's Soul" delay={0.7} />}
            </span>
          </h1>

          {/* Animated line */}
          <div style={{
            height: 3, margin: '20px auto',
            background: 'linear-gradient(90deg, transparent, #F18F01, #2E86AB, transparent)',
            borderRadius: 2,
            width: heroLoaded ? '200px' : '0px',
            transition: 'width 1.2s ease 1.5s'
          }} />

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            color: 'rgba(255,255,255,0.55)',
            lineHeight: 1.7, marginBottom: 12,
            maxWidth: 560, margin: '0 auto 12px',
            opacity: heroLoaded ? 1 : 0,
            transform: heroLoaded ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s ease 1.2s',
            fontWeight: 300, letterSpacing: '0.3px'
          }}>
            Your personal AI travel companion — discovers perfect destinations by learning what moves you
          </p>

          {/* Typewriter */}
          <div style={{
            fontSize: 'clamp(20px, 2.8vw, 28px)',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: 52, fontWeight: 600,
            minHeight: 44, letterSpacing: '-0.3px',
            opacity: heroLoaded ? 1 : 0,
            transition: 'opacity 0.8s ease 1.5s'
          }}>
            Explore{' '}
            <TypewriterText texts={[
              'Sun-Kissed Beaches',
              'Ancient Temples',
              'Himalayan Peaks',
              'Royal Palaces',
              'Wild Jungles',
              'Sacred Rivers',
              'Desert Forts'
            ]} />
          </div>

          {/* Search bar */}
          <div style={{
            opacity: heroLoaded ? 1 : 0,
            transform: heroLoaded ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 0.8s ease 1.8s',
            marginBottom: 48
          }}>
            <form onSubmit={handleSearch} style={{
              display: 'flex', maxWidth: 620, margin: '0 auto',
              borderRadius: 60, overflow: 'hidden',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.1), 0 30px 80px rgba(0,0,0,0.5)',
              background: 'rgba(255,255,255,0.97)'
            }}>
              <input
                placeholder="Search beaches, forts, wildlife, mountains..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  flex: 1, border: 'none', background: 'transparent',
                  padding: '20px 28px', fontSize: 15, outline: 'none',
                  color: 'var(--text)', fontFamily: 'Space Grotesk, sans-serif',
                  borderRadius: 0
                }}
              />
              <button type="submit" className="btn btn-primary"
                style={{ borderRadius: '0 60px 60px 0', padding: '18px 36px', margin: 0, fontSize: 15, whiteSpace: 'nowrap' }}>
                Search
              </button>
            </form>
          </div>

          {/* CTA buttons */}
          <div style={{
            display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap',
            opacity: heroLoaded ? 1 : 0,
            transform: heroLoaded ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 0.8s ease 2s'
          }}>
            {user ? (
              <Link to="/dashboard" className="btn btn-secondary" style={{ fontSize: 16, padding: '16px 40px', letterSpacing: '0.3px' }}>
                🎯 My Recommendations
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-secondary" style={{ fontSize: 16, padding: '16px 40px', letterSpacing: '0.3px' }}>
                  Get Started Free
                </Link>
                <Link to="/explore" className="btn btn-ghost" style={{ fontSize: 16, padding: '16px 40px', letterSpacing: '0.3px' }}>
                  Explore Places
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Bottom fade */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 120,
          background: 'linear-gradient(to bottom, transparent, #FAFAF8)',
          zIndex: 3, pointerEvents: 'none'
        }} />
      </div>

      {/* ===== TRENDING ===== */}
      <div style={{ padding: '100px 0', background: 'var(--bg)' }}>
        <div className="container">
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'flex-end', marginBottom: 60,
            flexWrap: 'wrap', gap: 20
          }}>
            <div className="reveal-left">
              <div className="section-tag">🔥 Trending Now</div>
              <h2 className="section-title">
                Top Destinations
              </h2>
              <p className="section-sub">
                Highest rated places loved by travelers across India
              </p>
            </div>
            <div className="reveal-right">
              <Link to="/explore" className="btn btn-outline">
                View All Places →
              </Link>
            </div>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 28 }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 420, animationDelay: i * 0.15 + 's' }} />
              ))}
            </div>
          ) : (
            <div className="grid-3">
              {trending.map((p, i) => (
                <PlaceCard key={p.id} place={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ===== CTA ===== */}
      <div style={{
        background: 'linear-gradient(135deg, #050d1a 0%, #0f2035 50%, #071a2a 100%)',
        padding: '120px 20px', textAlign: 'center',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(46,134,171,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(46,134,171,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)'
        }} />
        <div style={{
          position: 'absolute', width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(241,143,1,0.08) 0%, transparent 65%)',
          top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          animation: 'orbFloat 10s ease-in-out infinite', pointerEvents: 'none'
        }} />

        <div className="container reveal" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-block', fontSize: 72,
            animation: 'float 4s ease-in-out infinite',
            marginBottom: 28, filter: 'drop-shadow(0 8px 24px rgba(241,143,1,0.4))'
          }}>🌟</div>
          <h2 style={{
            fontSize: 'clamp(32px, 5vw, 56px)',
            fontFamily: 'Playfair Display, serif',
            color: 'white', marginBottom: 20, fontWeight: 700,
            letterSpacing: '-1px', lineHeight: 1.1
          }}>
            Your Perfect Trip<br />
            <span className="gradient-text-animated">Awaits Discovery</span>
          </h2>
          <p style={{
            color: 'rgba(255,255,255,0.55)', fontSize: 18,
            marginBottom: 48, maxWidth: 480, margin: '0 auto 48px',
            lineHeight: 1.8, fontWeight: 300
          }}>
            Let AI craft your dream Indian journey — personalized, intelligent, unforgettable
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn" style={{
              background: 'linear-gradient(135deg, #F18F01, #e07800)',
              color: 'white', fontSize: 17, padding: '18px 44px',
              fontWeight: 700, boxShadow: '0 8px 30px rgba(241,143,1,0.4)',
              letterSpacing: '0.3px'
            }}>
              Start Free Today
            </Link>
            <Link to="/explore" className="btn btn-ghost" style={{ fontSize: 17, padding: '18px 44px', letterSpacing: '0.3px' }}>
              Browse Destinations
            </Link>
          </div>
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <footer style={{
        background: '#030912', color: 'rgba(255,255,255,0.4)',
        padding: '56px 20px', textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{
          fontSize: 26, marginBottom: 16,
          fontFamily: 'Playfair Display, serif',
          color: 'white', fontWeight: 700
        }}>
          🗺️ TourAI
        </div>
        <p style={{ fontSize: 13, marginBottom: 8, letterSpacing: '0.3px' }}>
          AI-Based Tourist Recommendation System • Hybrid CBF + Collaborative Filtering Engine
        </p>
        <p style={{ fontSize: 11, opacity: 0.4, letterSpacing: '0.5px' }}>
          Based on: Thorat et al. (2015) — Survey on Hybrid Recommendation Systems
        </p>
      </footer>
    </div>
  )
}