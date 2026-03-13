'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Signup() {
  const router = useRouter()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return setError('All fields are required')
    }

    if (password.length < 8) {
      return setError('Password must be at least 8 characters')
    }

    if (password !== confirmPassword) {
      return setError('Passwords do not match')
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Signup failed')
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
          maxWidth: '420px',
          background: '#faf7ef',
          padding: '40px',
          borderRadius: '4px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 0 100px rgba(180,150,100,0.05)',
          position: 'relative',
          border: '1px solid rgba(180,150,100,0.1)'
        }}
      >
        {/* Paper texture */}
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.05,
          pointerEvents: 'none',
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")'
        }} />

        <h2 style={{
          color: '#2a2420',
          textAlign: 'center',
          fontSize: '1.8rem',
          marginBottom: '30px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase'
        }}>
          Sign Up
        </h2>

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

        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}
        >

          {/* First Name */}
          <InputField
            label="First Name"
            value={firstName}
            onChange={setFirstName}
          />

          {/* Last Name */}
          <InputField
            label="Last Name"
            value={lastName}
            onChange={setLastName}
          />

          {/* Email */}
          <InputField
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
          />

          {/* Password */}
          <InputField
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
          />

          {/* Confirm Password */}
          <InputField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={setConfirmPassword}
          />

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
            {loading ? 'Creating Account...' : 'Create Account'}
          </motion.button>
        </form>

        <p style={{
          textAlign: 'center',
          marginTop: '25px',
          fontSize: '0.75rem',
          color: 'rgba(42,36,32,0.6)'
        }}>
          Already have an account?{' '}
          <a href="/login" style={{ color: '#2a2420', fontWeight: 'bold' }}>
            Sign in
          </a>
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
          }}>
            ← Return to Typewriter
          </a>
        </div>
      </motion.div>
    </div>
  )
}

function InputField({
  label,
  type = 'text',
  value,
  onChange
}: {
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label style={{
        fontSize: '0.7rem',
        color: 'rgba(42,36,32,0.6)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em'
      }}>
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
  )
}