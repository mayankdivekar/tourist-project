import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

const STEPS = [
  {
    id: 'travel_type',
    title: 'How do you travel?',
    subtitle: 'This helps us understand your travel style',
    type: 'single',
    options: [
      { value: 'solo', emoji: '🧳', label: 'Solo Explorer', desc: 'Independent & adventurous' },
      { value: 'couple', emoji: '💑', label: 'Couple Getaway', desc: 'Romantic & intimate' },
      { value: 'family', emoji: '👨‍👩‍👧‍👦', label: 'Family Trip', desc: 'Fun for everyone' },
      { value: 'group', emoji: '👯', label: 'Group Travel', desc: 'More the merrier' },
    ]
  },
  {
    id: 'preferred_categories',
    title: 'What excites you most?',
    subtitle: 'Select all that match your vibe — the more you pick, the better we know you',
    type: 'multi',
    options: [
      { value: 'beach', emoji: '🏖️', label: 'Beach & Coast', desc: 'Sun, sand & waves' },
      { value: 'heritage', emoji: '🏛️', label: 'Heritage & History', desc: 'Forts, temples & ruins' },
      { value: 'hill', emoji: '⛰️', label: 'Hills & Mountains', desc: 'Fresh air & scenic views' },
      { value: 'wildlife', emoji: '🐯', label: 'Wildlife & Safari', desc: 'Nature & animals' },
      { value: 'adventure', emoji: '🧗', label: 'Adventure Sports', desc: 'Thrill & adrenaline' },
      { value: 'religious', emoji: '🛕', label: 'Spiritual & Religious', desc: 'Peace & devotion' },
      { value: 'nature', emoji: '🌿', label: 'Nature & Eco', desc: 'Forests & waterfalls' },
    ]
  },
  {
    id: 'budget',
    title: "What's your travel budget?",
    subtitle: 'We will match places to your spending comfort',
    type: 'single',
    options: [
      { value: 'low', emoji: '🎒', label: 'Budget Traveler', desc: 'Under ₹5,000 per trip' },
      { value: 'medium', emoji: '🏨', label: 'Mid Range', desc: '₹5,000 – ₹20,000 per trip' },
      { value: 'high', emoji: '✈️', label: 'Premium Experience', desc: 'Above ₹20,000 per trip' },
    ]
  },
  {
    id: 'season',
    title: 'When do you love to travel?',
    subtitle: 'We will suggest places perfect for your preferred season',
    type: 'single',
    options: [
      { value: 'winter', emoji: '❄️', label: 'Winter (Oct–Feb)', desc: 'Cool & comfortable' },
      { value: 'summer', emoji: '☀️', label: 'Summer (Mar–Jun)', desc: 'Warm & vibrant' },
      { value: 'monsoon', emoji: '🌧️', label: 'Monsoon (Jul–Sep)', desc: 'Lush & refreshing' },
      { value: 'any', emoji: '🌈', label: 'Any Season', desc: 'Always ready to go!' },
    ]
  }
]

export default function Onboarding() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({
    travel_type: '',
    preferred_categories: [],
    budget: '',
    season: ''
  })
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()
  const current = STEPS[step]

  const select = (value) => {
    if (current.type === 'single') {
      setAnswers({ ...answers, [current.id]: value })
    } else {
      const arr = answers[current.id]
      setAnswers({
        ...answers,
        [current.id]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]
      })
    }
  }

  const isSelected = (value) => {
    if (current.type === 'single') return answers[current.id] === value
    return answers[current.id]?.includes(value)
  }

  const canNext = () => {
    if (current.type === 'single') return answers[current.id] !== ''
    return answers[current.id]?.length > 0
  }

  const next = async () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1)
    } else {
      setSaving(true)
      try {
        await api.put('/auth/profile', {
          preferred_categories: answers.preferred_categories,
          budget: answers.budget,
          travel_type: answers.travel_type
        })
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        localStorage.setItem('user', JSON.stringify({
          ...user,
          preferred_categories: answers.preferred_categories,
          budget: answers.budget,
          travel_type: answers.travel_type
        }))
        navigate('/dashboard')
      } catch {
        navigate('/dashboard')
      }
      setSaving(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FAFAF8 0%, #F0F7FF 50%, #F5F0E8 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '100px 20px 40px'
    }}>
      {/* Progress bar */}
      <div style={{ width: '100%', maxWidth: 680, marginBottom: 40 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 13, color: 'var(--text-3)', fontWeight: 500 }}>
            Step {step + 1} of {STEPS.length}
          </span>
          <span style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600 }}>
            {Math.round(((step + 1) / STEPS.length) * 100)}% complete
          </span>
        </div>
        <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${((step + 1) / STEPS.length) * 100}%`,
            background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
            borderRadius: 3,
            transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
          }} />
        </div>
      </div>

      {/* Step card */}
      <div style={{
        width: '100%', maxWidth: 680,
        background: 'white',
        borderRadius: 28,
        padding: '48px 40px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
        animation: 'fadeInUp 0.5s ease forwards'
      }}>
        <div style={{ marginBottom: 36, textAlign: 'center' }}>
          <h2 style={{
            fontSize: 30, fontWeight: 700,
            fontFamily: 'Playfair Display, serif',
            marginBottom: 10, color: 'var(--text)'
          }}>{current.title}</h2>
          <p style={{ color: 'var(--text-2)', fontSize: 15 }}>{current.subtitle}</p>
        </div>

        {/* Options grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: current.options.length > 4 ? 'repeat(auto-fill, minmax(180px, 1fr))' : 'repeat(2, 1fr)',
          gap: 16, marginBottom: 36
        }}>
          {current.options.map(opt => (
            <button
              key={opt.value}
              onClick={() => select(opt.value)}
              style={{
                padding: '20px 16px',
                borderRadius: 16,
                border: `2px solid ${isSelected(opt.value) ? 'var(--primary)' : 'var(--border)'}`,
                background: isSelected(opt.value)
                  ? 'linear-gradient(135deg, rgba(46,134,171,0.1), rgba(241,143,1,0.05))'
                  : 'var(--surface)',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isSelected(opt.value) ? 'translateY(-4px)' : 'none',
                boxShadow: isSelected(opt.value) ? '0 8px 25px rgba(46,134,171,0.2)' : 'none',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 10 }}>{opt.emoji}</div>
              <div style={{
                fontSize: 15, fontWeight: 700,
                color: isSelected(opt.value) ? 'var(--primary)' : 'var(--text)',
                marginBottom: 4
              }}>{opt.label}</div>
              <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{opt.desc}</div>
              {isSelected(opt.value) && (
                <div style={{
                  marginTop: 8, fontSize: 16, color: 'var(--primary)'
                }}>✓</div>
              )}
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => step > 0 && setStep(step - 1)}
            style={{
              padding: '12px 24px', borderRadius: 50,
              border: '2px solid var(--border)',
              background: 'transparent', cursor: step === 0 ? 'not-allowed' : 'pointer',
              fontSize: 14, fontWeight: 600, color: 'var(--text-2)',
              opacity: step === 0 ? 0.4 : 1,
              fontFamily: 'Inter, sans-serif'
            }}
            disabled={step === 0}
          >← Back</button>

          <button
            onClick={next}
            disabled={!canNext() || saving}
            className="btn btn-primary"
            style={{ padding: '12px 32px', opacity: canNext() ? 1 : 0.5 }}
          >
            {saving ? '✨ Saving...' : step === STEPS.length - 1 ? '🚀 Get My Recommendations!' : 'Next →'}
          </button>
        </div>
      </div>

      {/* Skip */}
      <button
        onClick={() => navigate('/dashboard')}
        style={{
          marginTop: 20, background: 'none', border: 'none',
          color: 'var(--text-3)', fontSize: 13, cursor: 'pointer',
          fontFamily: 'Inter, sans-serif'
        }}
      >Skip for now →</button>
    </div>
  )
}