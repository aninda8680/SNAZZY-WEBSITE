import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../../context/AuthContext'
import logo from '../../../assets/logo1.png'

const EMERALD = '#1B3C34'
const CREAM   = '#FAF5E8'

export default function Register() {
  const { register, googleLogin } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', full_name: '', phone: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleGoogle(credentialResponse: any) {
    try {
      setError('')
      await googleLogin(credentialResponse.credential)
      navigate('/')
    } catch {
      setError('Google sign in failed. Try again.')
    }
  }

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form)
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: CREAM }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <img src={logo} alt="SNAZZY" className="h-20 mx-auto mb-4" />
          <p className="font-inter text-xs tracking-[0.4em] uppercase" style={{ color: `${EMERALD}80` }}>
            Create your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="border border-red-300 px-4 py-3">
              <p className="font-inter text-sm text-red-600">{error}</p>
            </div>
          )}

          {[
            { field: 'full_name', label: 'Full Name', type: 'text', placeholder: 'Your name' },
            { field: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
            { field: 'phone', label: 'Phone (optional)', type: 'tel', placeholder: '+91 98765 43210' },
            { field: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
          ].map(({ field, label, type, placeholder }) => (
            <div key={field} className="space-y-1.5">
              <label className="font-inter text-[10px] tracking-[0.3em] uppercase" style={{ color: `${EMERALD}70` }}>
                {label}
              </label>
              <input
                type={type}
                value={form[field as keyof typeof form]}
                onChange={set(field)}
                required={field !== 'phone'}
                className="w-full border-b px-0 py-2.5 font-inter text-sm bg-transparent outline-none transition-colors"
                style={{ borderColor: `${EMERALD}25`, color: EMERALD }}
                onFocus={(e) => (e.currentTarget.style.borderColor = EMERALD)}
                onBlur={(e) => (e.currentTarget.style.borderColor = `${EMERALD}25`)}
                placeholder={placeholder}
              />
            </div>
          ))}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 font-inter text-[11px] tracking-[0.4em] uppercase transition-all disabled:opacity-50"
              style={{ background: EMERALD, color: CREAM }}
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </div>
        </form>

        {/* Google Sign Up */}
        <div className="mt-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px" style={{ background: `${EMERALD}15` }} />
            <span className="font-inter text-[10px] tracking-[0.3em] uppercase" style={{ color: `${EMERALD}35` }}>or</span>
            <div className="flex-1 h-px" style={{ background: `${EMERALD}15` }} />
          </div>
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogle}
              onError={() => setError('Google sign in failed. Try again.')}
              width="368"
              shape="rectangular"
              text="signup_with"
            />
          </div>
        </div>

        <p className="mt-8 text-center font-inter text-sm" style={{ color: `${EMERALD}60` }}>
          Already have an account?{' '}
          <Link
            to="/login"
            className="underline underline-offset-2"
            style={{ color: EMERALD }}
          >
            Sign in
          </Link>
        </p>

        <div className="mt-4 text-center">
          <Link
            to="/"
            className="font-inter text-xs transition-opacity hover:opacity-70"
            style={{ color: `${EMERALD}45` }}
          >
            ← Back to store
          </Link>
        </div>
      </div>
    </div>
  )
}
