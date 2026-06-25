import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

const TABS = ['Overview', 'Users', 'Places', 'Reviews']

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('Overview')
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [places, setPlaces] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddPlace, setShowAddPlace] = useState(false)
  const [newPlace, setNewPlace] = useState({
    name: '', state: '', city: '', category: 'heritage',
    description: '', tags: '', budget: 'medium',
    best_season: 'winter', lat: '', lng: '', image: ''
  })
  const [adding, setAdding] = useState(false)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    if (user.role !== 'admin') { navigate('/'); return }
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [statsRes, usersRes, placesRes, reviewsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/places'),
        api.get('/admin/reviews')
      ])
      setStats(statsRes.data)
      setUsers(usersRes.data)
      setPlaces(placesRes.data)
      setReviews(reviewsRes.data)
    } catch (e) {
      alert('Error loading admin data')
    }
    setLoading(false)
  }

  const deleteUser = async (id) => {
    if (!confirm('Delete this user?')) return
    await api.delete('/admin/users/' + id)
    setUsers(users.filter(u => u.id !== id))
  }

  const deletePlace = async (id) => {
    if (!confirm('Delete this place? All its reviews will also be deleted.')) return
    await api.delete('/admin/places/' + id)
    setPlaces(places.filter(p => p.id !== id))
    loadData()
  }

  const deleteReview = async (id) => {
    if (!confirm('Delete this review?')) return
    await api.delete('/admin/reviews/' + id)
    setReviews(reviews.filter(r => r.id !== id))
  }

  const addPlace = async () => {
    if (!newPlace.name || !newPlace.city || !newPlace.state || !newPlace.description) {
      alert('Please fill all required fields')
      return
    }
    setAdding(true)
    try {
      const payload = {
        ...newPlace,
        tags: newPlace.tags.split(',').map(t => t.trim()).filter(Boolean),
        lat: parseFloat(newPlace.lat) || 0,
        lng: parseFloat(newPlace.lng) || 0
      }
      await api.post('/admin/places', payload)
      alert('Place added successfully!')
      setShowAddPlace(false)
      setNewPlace({ name: '', state: '', city: '', category: 'heritage', description: '', tags: '', budget: 'medium', best_season: 'winter', lat: '', lng: '', image: '' })
      loadData()
    } catch (e) {
      alert('Error adding place')
    }
    setAdding(false)
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#060e1a' }}>
      <div style={{ textAlign: 'center', color: 'white' }}>
        <div style={{ fontSize: 48, marginBottom: 16, animation: 'float 2s ease-in-out infinite' }}>⚙️</div>
        <p style={{ fontSize: 18, opacity: 0.6 }}>Loading admin panel...</p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#060e1a', paddingTop: 70 }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0a1628, #162032)',
        padding: '40px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
                Admin Panel
              </p>
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 36, color: 'white', fontWeight: 700 }}>
                TourAI Control Center
              </h1>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {TABS.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{
                  padding: '10px 20px', borderRadius: 50,
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: activeTab === tab ? '#F18F01' : 'rgba(255,255,255,0.06)',
                  color: activeTab === tab ? 'white' : 'rgba(255,255,255,0.6)',
                  cursor: 'pointer', fontSize: 14, fontWeight: 600,
                  fontFamily: 'Space Grotesk, sans-serif',
                  transition: 'all 0.3s'
                }}>{tab}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px' }}>

        {/* OVERVIEW TAB */}
        {activeTab === 'Overview' && stats && (
          <div>
            {/* Stats cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 40 }}>
              {[
                { label: 'Total Users', value: stats.total_users, icon: '👥', color: '#2E86AB' },
                { label: 'Tourist Places', value: stats.total_places, icon: '📍', color: '#F18F01' },
                { label: 'Total Reviews', value: stats.total_reviews, icon: '⭐', color: '#3B9E4A' },
                { label: 'Behavior Logs', value: stats.total_behaviors, icon: '📊', color: '#8B5CF6' },
              ].map(item => (
                <div key={item.label} style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 20, padding: '28px 24px',
                  transition: 'all 0.3s'
                }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>{item.icon}</div>
                  <div style={{ fontSize: 40, fontWeight: 900, color: item.color, fontFamily: 'Playfair Display, serif', marginBottom: 4 }}>
                    {item.value}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, letterSpacing: '0.5px' }}>{item.label}</div>
                </div>
              ))}
            </div>

            {/* Category breakdown */}
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 20, padding: 28, marginBottom: 40
            }}>
              <h3 style={{ color: 'white', fontSize: 18, fontWeight: 700, marginBottom: 24, fontFamily: 'Playfair Display, serif' }}>
                Places by Category
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
                {Object.entries(stats.category_stats).map(([cat, count]) => (
                  <div key={cat} style={{
                    background: 'rgba(255,255,255,0.04)',
                    borderRadius: 12, padding: '14px 16px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: 24, marginBottom: 6 }}>
                      {cat === 'beach' ? '🏖️' : cat === 'heritage' ? '🏛️' : cat === 'hill' ? '⛰️' : cat === 'wildlife' ? '🐯' : cat === 'adventure' ? '🧗' : cat === 'religious' ? '🛕' : '🌿'}
                    </div>
                    <div style={{ color: 'white', fontSize: 22, fontWeight: 700 }}>{count}</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>{cat}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent users */}
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 20, padding: 28
            }}>
              <h3 style={{ color: 'white', fontSize: 18, fontWeight: 700, marginBottom: 24, fontFamily: 'Playfair Display, serif' }}>
                Recent Signups
              </h3>
              {stats.recent_users.map(u => (
                <div key={u.id} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.06)'
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #2E86AB, #F18F01)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 700, fontSize: 16, flexShrink: 0
                  }}>
                    {u.name?.[0]?.toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: 'white', fontWeight: 600, fontSize: 14 }}>{u.name}</p>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{u.email}</p>
                  </div>
                  <span style={{
                    padding: '3px 12px', borderRadius: 20,
                    background: u.role === 'admin' ? 'rgba(241,143,1,0.2)' : 'rgba(46,134,171,0.2)',
                    color: u.role === 'admin' ? '#F18F01' : '#2E86AB',
                    fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1
                  }}>{u.role || 'user'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'Users' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ color: 'white', fontSize: 24, fontFamily: 'Playfair Display, serif' }}>
                All Users ({users.length})
              </h2>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 20, overflow: 'hidden'
            }}>
              {users.map((u, i) => (
                <div key={u.id} style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  padding: '16px 24px',
                  borderBottom: i < users.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  transition: 'background 0.2s'
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #2E86AB, #F18F01)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 700, fontSize: 18, flexShrink: 0
                  }}>
                    {u.name?.[0]?.toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: 'white', fontWeight: 600, fontSize: 15 }}>{u.name}</p>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>{u.email}</p>
                    {u.preferred_categories?.length > 0 && (
                      <div style={{ marginTop: 6, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {u.preferred_categories.map(c => (
                          <span key={c} style={{
                            padding: '2px 8px', borderRadius: 20,
                            background: 'rgba(46,134,171,0.15)',
                            color: '#2E86AB', fontSize: 10, fontWeight: 700,
                            textTransform: 'uppercase', letterSpacing: 0.5
                          }}>{c}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{
                      padding: '4px 14px', borderRadius: 20,
                      background: u.role === 'admin' ? 'rgba(241,143,1,0.15)' : 'rgba(255,255,255,0.06)',
                      color: u.role === 'admin' ? '#F18F01' : 'rgba(255,255,255,0.5)',
                      fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1
                    }}>{u.role || 'user'}</span>
                    {u.role !== 'admin' && (
                      <button onClick={() => deleteUser(u.id)} style={{
                        padding: '6px 16px', borderRadius: 20,
                        background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
                        color: '#EF4444', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                        fontFamily: 'Space Grotesk, sans-serif', transition: 'all 0.2s'
                      }}>Delete</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PLACES TAB */}
        {activeTab === 'Places' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ color: 'white', fontSize: 24, fontFamily: 'Playfair Display, serif' }}>
                All Places ({places.length})
              </h2>
              <button onClick={() => setShowAddPlace(!showAddPlace)} className="btn btn-secondary"
                style={{ fontSize: 14, padding: '10px 24px' }}>
                {showAddPlace ? '✕ Cancel' : '+ Add New Place'}
              </button>
            </div>

            {/* Add Place Form */}
            {showAddPlace && (
              <div style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 20, padding: 32, marginBottom: 32
              }}>
                <h3 style={{ color: 'white', fontSize: 20, fontFamily: 'Playfair Display, serif', marginBottom: 24 }}>
                  Add New Tourist Place
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
                  {[
                    { key: 'name', label: 'Place Name *', placeholder: 'e.g. Taj Mahal' },
                    { key: 'city', label: 'City *', placeholder: 'e.g. Agra' },
                    { key: 'state', label: 'State *', placeholder: 'e.g. Uttar Pradesh' },
                    { key: 'lat', label: 'Latitude', placeholder: 'e.g. 27.1751' },
                    { key: 'lng', label: 'Longitude', placeholder: 'e.g. 78.0421' },
                    { key: 'image', label: 'Image Path', placeholder: 'e.g. /places/taj-mahal.jpg' },
                    { key: 'tags', label: 'Tags (comma separated)', placeholder: 'e.g. UNESCO, mughal, monument' },
                  ].map(field => (
                    <div key={field.key}>
                      <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
                        {field.label}
                      </label>
                      <input
                        placeholder={field.placeholder}
                        value={newPlace[field.key]}
                        onChange={e => setNewPlace({ ...newPlace, [field.key]: e.target.value })}
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: 10 }}
                      />
                    </div>
                  ))}
                  <div>
                    <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
                      Category
                    </label>
                    <select value={newPlace.category} onChange={e => setNewPlace({ ...newPlace, category: e.target.value })}
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: 10 }}>
                      {['heritage', 'beach', 'nature', 'wildlife', 'hill', 'adventure', 'religious'].map(c => (
                        <option key={c} value={c} style={{ background: '#1a1a2e' }}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
                      Budget
                    </label>
                    <select value={newPlace.budget} onChange={e => setNewPlace({ ...newPlace, budget: e.target.value })}
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: 10 }}>
                      {['low', 'medium', 'high'].map(b => (
                        <option key={b} value={b} style={{ background: '#1a1a2e' }}>{b}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
                      Best Season
                    </label>
                    <select value={newPlace.best_season} onChange={e => setNewPlace({ ...newPlace, best_season: e.target.value })}
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: 10 }}>
                      {['winter', 'summer', 'spring', 'monsoon', 'any'].map(s => (
                        <option key={s} value={s} style={{ background: '#1a1a2e' }}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div style={{ marginTop: 16 }}>
                  <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
                    Description *
                  </label>
                  <textarea
                    placeholder="Describe the tourist place..."
                    value={newPlace.description}
                    onChange={e => setNewPlace({ ...newPlace, description: e.target.value })}
                    rows={4}
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: 10 }}
                  />
                </div>
                <button onClick={addPlace} disabled={adding} className="btn btn-primary" style={{ marginTop: 20, padding: '12px 32px' }}>
                  {adding ? 'Adding...' : '✓ Add Place'}
                </button>
              </div>
            )}

            {/* Places list */}
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 20, overflow: 'hidden'
            }}>
              {places.map((p, i) => (
                <div key={p.id} style={{
                  display: 'flex', alignItems: 'center', gap: 16, padding: '16px 24px',
                  borderBottom: i < places.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none'
                }}>
                  <img src={p.image} alt={p.name}
                    style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 12, flexShrink: 0 }}
                    onError={e => e.target.src = '/places/taj-mahal.jpg'}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{ color: 'white', fontWeight: 700, fontSize: 15, marginBottom: 2, fontFamily: 'Playfair Display, serif' }}>
                      {p.name}
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
                      📍 {p.city}, {p.state} • {p.category} • ⭐ {(p.avg_rating || 0).toFixed(1)}
                    </p>
                  </div>
                  <button onClick={() => deletePlace(p.id)} style={{
                    padding: '6px 16px', borderRadius: 20,
                    background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
                    color: '#EF4444', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                    fontFamily: 'Space Grotesk, sans-serif', transition: 'all 0.2s'
                  }}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REVIEWS TAB */}
        {activeTab === 'Reviews' && (
          <div>
            <h2 style={{ color: 'white', fontSize: 24, fontFamily: 'Playfair Display, serif', marginBottom: 24 }}>
              All Reviews ({reviews.length})
            </h2>
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 20, overflow: 'hidden'
            }}>
              {reviews.length === 0 && (
                <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                  No reviews yet
                </div>
              )}
              {reviews.map((r, i) => (
                <div key={r.id} style={{
                  padding: '20px 24px',
                  borderBottom: i < reviews.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 38, height: 38, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #2E86AB, #F18F01)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontWeight: 700, fontSize: 15, flexShrink: 0
                      }}>
                        {r.user_name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p style={{ color: 'white', fontWeight: 600, fontSize: 14 }}>{r.user_name}</p>
                        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>Place ID: {r.place_id?.slice(-8)}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ color: '#F59E0B', fontSize: 16 }}>{'★'.repeat(r.rating)}</span>
                      <button onClick={() => deleteReview(r.id)} style={{
                        padding: '5px 14px', borderRadius: 20,
                        background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
                        color: '#EF4444', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                        fontFamily: 'Space Grotesk, sans-serif'
                      }}>Delete</button>
                    </div>
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.6, paddingLeft: 50 }}>
                    {r.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}