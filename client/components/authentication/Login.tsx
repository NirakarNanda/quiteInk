'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      return setError('Email and password required')
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Login failed')
      }

      // Save token to localStorage
      localStorage.setItem('token', data.token)
      localStorage.setItem('userInfo', JSON.stringify(data.user))

      // Navigate to dashboard/home
      router.push('/')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#1c1410',
      fontFamily: '"Special Elite", cursive',
      padding: '20px'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          width: '100%',
          maxWidth: '400px',
          background: '#faf7ef',
          padding: '40px',
          borderRadius: '4px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 0 100px rgba(180,150,100,0.05)',
          position: 'relative',
          border: '1px solid rgba(180,150,100,0.1)'
        }}
      >
        {/* Vintage paper texture overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          opacity: 0.05, pointerEvents: 'none',
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")'
        }} />

        <h2 style={{
          color: '#2a2420',
          textAlign: 'center',
          fontSize: '1.8rem',
          marginBottom: '30px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase'
        }}>Login</h2>

        {error && (
          <p style={{
            color: '#8b2f2f',
            fontSize: '0.8rem',
            marginBottom: '15px',
            textAlign: 'center'
          }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.7rem', color: 'rgba(42,36,32,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: '1px solid rgba(42,36,32,0.2)',
                padding: '8px 0',
                outline: 'none',
                fontSize: '1rem',
                color: '#2a2420',
                fontFamily: '"Courier Prime", monospace'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.7rem', color: 'rgba(42,36,32,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: '1px solid rgba(42,36,32,0.2)',
                padding: '8px 0',
                outline: 'none',
                fontSize: '1rem',
                color: '#2a2420',
                fontFamily: '"Courier Prime", monospace'
              }}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            style={{
              marginTop: '10px',
              background: '#2a2420',
              color: '#faf7ef',
              border: 'none',
              padding: '12px',
              borderRadius: '4px',
              cursor: loading ? 'wait' : 'pointer',
              fontSize: '0.9rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </motion.button>
        </form>

        <p style={{
          textAlign: 'center',
          marginTop: '30px',
          fontSize: '0.75rem',
          color: 'rgba(42,36,32,0.6)'
        }}>
          New here? <a href="/signup" style={{ color: '#2a2420', fontWeight: 'bold' }}>Create an account</a>
        </p>

        <div style={{
          textAlign: 'center',
          marginTop: '20px'
        }}>
          <a href="/" style={{
            fontSize: '0.65rem',
            color: 'rgba(42,36,32,0.4)',
            textDecoration: 'none',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}>← Return to Typewriter</a>
        </div>
      </motion.div>
    </div>
  )
}
