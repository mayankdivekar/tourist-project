import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import PlaceCard from '../components/PlaceCard'
import api from '../api'

export default function PlaceDetail() {
  const { id } = useParams()
  const [place, setPlace] = useState(null)
  const [reviews, setReviews] = useState([])
  const [similar, setSimilar] = useState([])
  const [rating, setRating] = useState(4)
  const [comment, setComment] = useState('')
  const [wishlist, setWishlist] = useState(false)
  const [liked, setLiked] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [currentImg, setCurrentImg] = useState(0)
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  useEffect(() => {
    window.scrollTo(0, 0)
    api.get('/places/' + id).then(r => setPlace(r.data))
    api.get('/reviews/' + id).then(r => setReviews(r.data))
    api.get('/recommendations/similar/' + id).then(r => setSimilar(r.data)).catch(() => {})
    const start = Date.now()
    if (user) api.post('/behavior', { place_id: id, event_type: 'view', time_spent_sec: 0 })
    return () => {
      const t = Math.round((Date.now() - start) / 1000)
      if (user) api.post('/behavior', { place_id: id, event_type: 'view', time_spent_sec: t })
    }
  }, [id])

  const submitReview = async () => {
    if (!user) { alert('Please login'); return }
    if (!comment.trim()) { alert('Please write a comment'); return }
    setSubmitting(true)
    try {
      await api.post('/reviews', { place_id: id, rating, comment })
      const r = await api.get('/reviews/' + id)
      setReviews(r.data)
      setComment('')
      alert('Review submitted!')
    } catch (e) {
      alert('Error submitting review')
    }
    setSubmitting(false)
  }

  const toggleWishlist = async () => {
    if (!user) { alert('Please login'); return }
    await api.post('/places/wishlist/' + id)
    setWishlist(w => !w)
  }

  const toggleLike = async () => {
    if (!user) { alert('Please login'); return }
    await api.post('/places/like/' + id)
    setLiked(l => !l)
  }

  if (!place) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading...</p>
      </div>
    )
  }

  const images = place.images && place.images.length > 0 ? place.images : [place.image]
  const fallback = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=80'
  const mapsUrl = 'https://www.google.com/maps/search/' + encodeURIComponent(place.name + ' ' + place.city + ' ' + place.state)

  const prevImg = () => setCurrentImg(i => (i === 0 ? images.length - 1 : i - 1))
  const nextImg = () => setCurrentImg(i => (i === images.length - 1 ? 0 : i + 1))

  return (
    <div style={{ paddingTop: 70, minHeight: '100vh' }}>
      {/* Photo Carousel */}
      <div style={{ position: 'relative', height: '60vh', overflow: 'hidden', background: '#000' }}>
        <img
          src={images[currentImg] || fallback}
          alt={place.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9, transition: 'opacity 0.4s ease' }}
          onError={e => { e.target.src = fallback }}
        />

        {/* Gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)' }} />

        {/* Left arrow */}
        {images.length > 1 && (
          <button
            onClick={prevImg}
            style={{
              position: 'absolute', left: 20, top: '50%',
              transform: 'translateY(-50%)',
              width: 48, height: 48, borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'white', fontSize: 20, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.3s', zIndex: 10
            }}
            onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.4)'}
            onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.2)'}
          >
            {'‹'}
          </button>
        )}

        {/* Right arrow */}
        {images.length > 1 && (
          <button
            onClick={nextImg}
            style={{
              position: 'absolute', right: 20, top: '50%',
              transform: 'translateY(-50%)',
              width: 48, height: 48, borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'white', fontSize: 20, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.3s', zIndex: 10
            }}
            onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.4)'}
            onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.2)'}
          >
            {'›'}
          </button>
        )}

        {/* Dot indicators */}
        {images.length > 1 && (
          <div style={{
            position: 'absolute', bottom: 100, left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex', gap: 8, zIndex: 10
          }}>
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentImg(i)}
                style={{
                  width: i === currentImg ? 24 : 8,
                  height: 8, borderRadius: 4,
                  background: i === currentImg ? 'white' : 'rgba(255,255,255,0.5)',
                  border: 'none', cursor: 'pointer',
                  transition: 'all 0.3s', padding: 0
                }}
              />
            ))}
          </div>
        )}

        {/* Photo counter */}
        {images.length > 1 && (
          <div style={{
            position: 'absolute', top: 20, right: 20,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(10px)',
            color: 'white', padding: '4px 12px',
            borderRadius: 20, fontSize: 13, fontWeight: 600
          }}>
            {(currentImg + 1) + ' / ' + images.length}
          </div>
        )}

        {/* Place info overlay */}
        <div style={{ position: 'absolute', bottom: 32, left: 0, right: 0, padding: '0 24px' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  <span className="badge badge-ocean">{place.category}</span>
                  <span className="badge badge-amber">{place.best_season}</span>
                </div>
                <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 5vw, 48px)', color: 'white', fontWeight: 700, marginBottom: 8 }}>
                  {place.name}
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16 }}>
                  {place.city}, {place.state}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={toggleWishlist} className="btn btn-ghost">
                  {wishlist ? 'Saved' : 'Save'}
                </button>
                <button onClick={toggleLike} className="btn btn-ghost">
                  {liked ? 'Liked' : 'Like'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div style={{
          display: 'flex', gap: 8, padding: '12px 24px',
          background: '#111', overflowX: 'auto'
        }}>
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={'Photo ' + (i + 1)}
              onClick={() => setCurrentImg(i)}
              style={{
                width: 80, height: 56, objectFit: 'cover',
                borderRadius: 6, cursor: 'pointer', flexShrink: 0,
                border: i === currentImg ? '2px solid #2E86AB' : '2px solid transparent',
                opacity: i === currentImg ? 1 : 0.6,
                transition: 'all 0.2s'
              }}
              onError={e => { e.target.src = fallback }}
            />
          ))}
        </div>
      )}

      <div className="container" style={{ padding: '40px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32 }}>
          <div>
            <div className="card" style={{ padding: 32, marginBottom: 28 }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, marginBottom: 16 }}>About</h2>
              <p style={{ fontSize: 16, color: 'var(--text-2)', lineHeight: 1.8 }}>{place.description}</p>
              <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {(place.tags || []).map(tag => (
                  <span key={tag} className="tag">{'#' + tag}</span>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: 32, marginBottom: 28 }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, marginBottom: 16 }}>Rate and Review</h2>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setRating(n)} style={{ fontSize: 32, background: 'none', border: 'none', cursor: 'pointer', color: n <= rating ? '#F59E0B' : '#E2E8F0' }}>
                    {'★'}
                  </button>
                ))}
              </div>
              <textarea
                placeholder="Share your experience..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                rows={4}
                style={{ marginBottom: 16 }}
              />
              <button onClick={submitReview} className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>

            <div className="card" style={{ padding: 32 }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, marginBottom: 20 }}>
                {'Reviews (' + reviews.length + ')'}
              </h2>
              {reviews.length === 0 && (
                <p style={{ color: 'var(--text-2)' }}>No reviews yet. Be the first!</p>
              )}
              {reviews.map(r => (
                <div key={r.id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: 16, marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 36, height: 36,
                        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontWeight: 700, fontSize: 14
                      }}>
                        {r.user_name ? r.user_name[0].toUpperCase() : 'U'}
                      </div>
                      <strong>{r.user_name}</strong>
                    </div>
                    <span style={{ color: '#F59E0B' }}>{'★'.repeat(r.rating)}</span>
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--text-2)' }}>{r.comment}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ position: 'sticky', top: 90 }}>
            <div className="card" style={{ padding: 24, marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, marginBottom: 16 }}>Quick Info</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-2)', fontSize: 14 }}>Rating</span>
                <span style={{ fontWeight: 600 }}>{(place.avg_rating || 0).toFixed(1) + ' / 5'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-2)', fontSize: 14 }}>Budget</span>
                <span style={{ fontWeight: 600 }}>
                  {place.budget === 'high' ? 'Premium' : place.budget === 'medium' ? 'Mid-range' : 'Budget'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-2)', fontSize: 14 }}>Best Season</span>
                <span style={{ fontWeight: 600 }}>{place.best_season}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-2)', fontSize: 14 }}>Category</span>
                <span style={{ fontWeight: 600 }}>{place.category}</span>
              </div>
              <a href={mapsUrl} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 20, display: 'flex' }}>
                View on Google Maps
              </a>
            </div>

            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Share this place</h3>
              <div style={{ display: 'flex', gap: 10 }}>
                {['WhatsApp', 'Twitter', 'Facebook'].map(s => (
                  <button key={s} style={{
                    flex: 1, padding: '10px 6px', borderRadius: 10,
                    border: '1px solid var(--border)', background: 'var(--surface-2)',
                    cursor: 'pointer', fontSize: 11, fontWeight: 600,
                    color: 'var(--text-2)', fontFamily: 'Inter, sans-serif'
                  }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {similar.length > 0 && (
          <div style={{ marginTop: 60 }}>
            <div style={{ marginBottom: 32 }}>
              <div className="section-tag">AI Content-Based</div>
              <h2 className="section-title">Similar Destinations</h2>
              <p className="section-sub">Powered by TF-IDF and Cosine Similarity</p>
            </div>
            <div className="grid-3">
              {similar.map((p, i) => (
                <PlaceCard key={p.id} place={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}