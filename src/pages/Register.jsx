import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  async function handleSignup(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await api.post('/api/auth/signup', {
        username,
        password,
        name,
      })

      // After successful signup → redirect to login page
      navigate('/login')
    } catch (err) {
      console.error(err)
      setError('Signup failed. Try a different username.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: 800, margin: '0 auto' }}>
      <h1>Create Account</h1>

      <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Signing up…' : 'Register'}
        </button>

        {error && <div style={{ color: 'red' }}>{error}</div>}
      </form>

      <p style={{ marginTop: '1rem' }}>
        Already have an account?{' '}
        <a href="/login" style={{ textDecoration: 'underline' }}>
          Login here
        </a>
      </p>
    </div>
  )
}
