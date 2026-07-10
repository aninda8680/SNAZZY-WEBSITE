import { useState, FormEvent, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Lock, LogOut, ShoppingBag } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../api/client'

const EMERALD = '#1B3C34'
const CREAM   = '#FAF5E8'

export default function Account() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [name, setName]   = useState(user?.full_name ?? '')
  const [phone, setPhone] = useState('')
  const [profileMsg, setProfileMsg] = useState('')
  const [profileErr, setProfileErr] = useState('')
  const [profileLoading, setProfileLoading] = useState(false)

  const [curPwd, setCurPwd]   = useState('')
  const [newPwd, setNewPwd]   = useState('')
  const [pwdMsg, setPwdMsg]   = useState('')
  const [pwdErr, setPwdErr]   = useState('')
  const [pwdLoading, setPwdLoading] = useState(false)

  useEffect(() => {
    api.get('/api/auth/me').then(res => {
      setName(res.data.user.full_name)
      setPhone(res.data.user.phone ?? '')
    })
  }, [])

  async function handleProfile(e: FormEvent) {
    e.preventDefault()
    setProfileErr('')
    setProfileMsg('')
    setProfileLoading(true)
    try {
      await api.put('/api/auth/me', { full_name: name, phone })
      setProfileMsg('Profile updated.')
    } catch (err: any) {
      setProfileErr(err.response?.data?.error || 'Update failed.')
    } finally {
      setProfileLoading(false)
    }
  }

  async function handlePassword(e: FormEvent) {
    e.preventDefault()
    setPwdErr('')
    setPwdMsg('')
    if (newPwd.length < 8) { setPwdErr('New password must be at least 8 characters.'); return }
    setPwdLoading(true)
    try {
      await api.put('/api/auth/password', { current_password: curPwd, new_password: newPwd })
      setPwdMsg('Password changed.')
      setCurPwd('')
      setNewPwd('')
    } catch (err: any) {
      setPwdErr(err.response?.data?.error || 'Failed to change password.')
    } finally {
      setPwdLoading(false)
    }
  }

  const inputCls = 'w-full border-b px-0 py-2.5 font-inter text-sm bg-transparent outline-none transition-colors'

  return (
    <div className="min-h-screen" style={{ background: CREAM }}>

      {/* Header */}
      <div className="sticky top-0 z-40 border-b flex items-center justify-between px-5 h-14"
        style={{ background: CREAM, borderColor: `${EMERALD}15` }}>
        <Link to="/" className="flex items-center gap-2" style={{ color: `${EMERALD}60` }}>
          <ArrowLeft className="w-4 h-4" />
          <span className="font-inter text-[10px] tracking-[0.25em] uppercase">Back</span>
        </Link>
        <span className="font-inter text-[10px] tracking-[0.45em] uppercase" style={{ color: `${EMERALD}40` }}>
          My Account
        </span>
        <button
          onClick={() => { logout(); navigate('/') }}
          className="flex items-center gap-1.5 font-inter text-[10px] tracking-[0.25em] uppercase"
          style={{ color: `${EMERALD}50` }}
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </div>

      <div className="max-w-sm mx-auto px-5 py-10 space-y-10">

        {/* User info pill */}
        <div className="flex items-center gap-3 pb-8 border-b" style={{ borderColor: `${EMERALD}10` }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: `${EMERALD}12` }}>
            <User className="w-5 h-5" style={{ color: EMERALD }} />
          </div>
          <div>
            <p className="font-bodoni text-lg leading-tight" style={{ color: EMERALD }}>{user?.full_name}</p>
            <p className="font-inter text-xs mt-0.5" style={{ color: `${EMERALD}50` }}>{user?.email}</p>
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-3">
          <Link to="/orders"
            className="flex items-center justify-center gap-2 py-4 border border-[#1B3C34]/20 font-inter text-[11px] tracking-[0.25em] uppercase text-[#1B3C34] transition-all duration-200 hover:bg-[#1B3C34] hover:text-[#FAF5E8] hover:border-[#1B3C34] active:opacity-80">
            <ShoppingBag className="w-4 h-4 flex-shrink-0" />
            My Orders
          </Link>
          <Link to="/"
            className="flex items-center justify-center gap-2 py-4 bg-[#1B3C34] font-inter text-[11px] tracking-[0.25em] uppercase text-[#FAF5E8] transition-all duration-200 hover:opacity-80 active:opacity-60">
            Shop Now
          </Link>
        </div>

        {/* Edit profile */}
        <div>
          <h2 className="font-inter text-[10px] tracking-[0.4em] uppercase mb-6"
            style={{ color: `${EMERALD}50` }}>Edit Profile</h2>

          <form onSubmit={handleProfile} className="space-y-5">
            {profileMsg && <p className="font-inter text-xs text-emerald-700">{profileMsg}</p>}
            {profileErr && <p className="font-inter text-xs text-red-500">{profileErr}</p>}

            {[
              { label: 'Full Name', value: name, set: setName, type: 'text' },
              { label: 'Phone', value: phone, set: setPhone, type: 'tel' },
            ].map(({ label, value, set, type }) => (
              <div key={label} className="space-y-1.5">
                <label className="font-inter text-[10px] tracking-[0.3em] uppercase"
                  style={{ color: `${EMERALD}60` }}>{label}</label>
                <input
                  type={type} value={value} onChange={e => set(e.target.value)}
                  className={inputCls} style={{ borderColor: `${EMERALD}20`, color: EMERALD }}
                  onFocus={e => (e.currentTarget.style.borderColor = EMERALD)}
                  onBlur={e => (e.currentTarget.style.borderColor = `${EMERALD}20`)}
                />
              </div>
            ))}

            <button type="submit" disabled={profileLoading}
              className="w-full py-4 font-inter text-[11px] tracking-[0.4em] uppercase transition-all disabled:opacity-50"
              style={{ background: EMERALD, color: CREAM }}>
              {profileLoading ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Change password */}
        <div className="border-t pt-8" style={{ borderColor: `${EMERALD}10` }}>
          <h2 className="font-inter text-[10px] tracking-[0.4em] uppercase mb-6 flex items-center gap-2"
            style={{ color: `${EMERALD}50` }}>
            <Lock className="w-3 h-3" /> Change Password
          </h2>

          <form onSubmit={handlePassword} className="space-y-5">
            {pwdMsg && <p className="font-inter text-xs text-emerald-700">{pwdMsg}</p>}
            {pwdErr && <p className="font-inter text-xs text-red-500">{pwdErr}</p>}

            {[
              { label: 'Current Password', value: curPwd, set: setCurPwd },
              { label: 'New Password',     value: newPwd, set: setNewPwd },
            ].map(({ label, value, set }) => (
              <div key={label} className="space-y-1.5">
                <label className="font-inter text-[10px] tracking-[0.3em] uppercase"
                  style={{ color: `${EMERALD}60` }}>{label}</label>
                <input
                  type="password" value={value} onChange={e => set(e.target.value)}
                  className={inputCls} style={{ borderColor: `${EMERALD}20`, color: EMERALD }}
                  onFocus={e => (e.currentTarget.style.borderColor = EMERALD)}
                  onBlur={e => (e.currentTarget.style.borderColor = `${EMERALD}20`)}
                  placeholder="••••••••"
                />
              </div>
            ))}

            <button type="submit" disabled={pwdLoading}
              className="w-full py-4 font-inter text-[11px] tracking-[0.4em] uppercase transition-all disabled:opacity-50"
              style={{ background: EMERALD, color: CREAM }}>
              {pwdLoading ? 'Updating…' : 'Update Password'}
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}
