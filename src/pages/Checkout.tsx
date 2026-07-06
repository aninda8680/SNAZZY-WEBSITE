import { useState, useEffect, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import api from '../api/client'

declare global {
  interface Window { Razorpay: any }
}

interface Address {
  id?: string
  full_name: string
  phone: string
  line1: string
  line2: string
  city: string
  state: string
  pincode: string
}

const emptyAddress: Address = {
  full_name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '',
}

const EMERALD = '#1B3C34'
const CREAM   = '#FAF5E8'

export default function Checkout() {
  const { items, total, closeCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [address, setAddress] = useState<Address>(emptyAddress)
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([])
  const [step, setStep] = useState<'address' | 'review'>('address')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/api/orders/user/addresses')
      .then((r) => setSavedAddresses(r.data.addresses || []))
      .catch(() => {})
  }, [])

  const set = (field: keyof Address) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setAddress((a) => ({ ...a, [field]: e.target.value }))

  async function handleAddressSubmit(e: FormEvent) {
    e.preventDefault()
    setStep('review')
  }

  async function handlePay() {
    setLoading(true)
    setError('')
    try {
      // Save address
      const addrRes = await api.post('/api/orders/address', address)
      const address_id = addrRes.data.address.id

      // Create Razorpay order on backend
      const orderRes = await api.post('/api/payments/create-order', {
        address_id,
        items: items.map((i) => ({ product_id: String(i.id), quantity: i.quantity })),
      })

      const { razorpay_order_id, amount, key_id, order_id } = orderRes.data

      // Load Razorpay script dynamically
      if (!window.Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement('script')
          s.src = 'https://checkout.razorpay.com/v1/checkout.js'
          s.onload = () => resolve()
          s.onerror = () => reject(new Error('Failed to load Razorpay'))
          document.body.appendChild(s)
        })
      }

      const rzp = new window.Razorpay({
        key: key_id,
        amount,
        currency: 'INR',
        order_id: razorpay_order_id,
        name: 'SNAZZY',
        description: 'Premium Embroidered Streetwear',
        prefill: {
          name: user?.full_name,
          email: user?.email,
          contact: address.phone,
        },
        theme: { color: EMERALD },
        handler: async (response: any) => {
          // Verify on backend — NEVER trust frontend alone
          await api.post('/api/payments/verify', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            order_id,
          })
          closeCart()
          navigate(`/order-success?order=${order_id}`)
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      })

      rzp.on('payment.failed', (resp: any) => {
        setError(resp.error?.description || 'Payment failed. Please try again.')
        setLoading(false)
      })

      rzp.open()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ background: CREAM }}
      >
        <p className="font-inter text-sm" style={{ color: `${EMERALD}60` }}>Your cart is empty.</p>
        <button
          onClick={() => navigate('/')}
          className="font-inter text-sm underline underline-offset-2 transition-opacity hover:opacity-70"
          style={{ color: EMERALD }}
        >
          Go back to shop
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: CREAM, color: EMERALD }}>
      <div className="max-w-5xl mx-auto px-6 py-16">
        <button
          onClick={() => navigate('/')}
          className="font-inter text-xs mb-10 transition-opacity hover:opacity-60"
          style={{ color: `${EMERALD}60` }}
        >
          ← Back to store
        </button>

        <h1 className="font-bodoni font-black text-4xl mb-12" style={{ color: EMERALD }}>Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* Left — address / review */}
          <div className="lg:col-span-3">
            {step === 'address' ? (
              <form onSubmit={handleAddressSubmit} className="space-y-5">
                <h2 className="font-bodoni font-bold text-xl mb-6" style={{ color: EMERALD }}>
                  Shipping Address
                </h2>

                {savedAddresses.length > 0 && (
                  <div className="space-y-3 mb-6">
                    <p
                      className="font-inter text-xs tracking-[0.2em] uppercase"
                      style={{ color: `${EMERALD}50` }}
                    >
                      Saved Addresses
                    </p>
                    {savedAddresses.map((a: any) => (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => setAddress(a)}
                        className="w-full text-left p-4 border transition-colors"
                        style={{ borderColor: `${EMERALD}15` }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${EMERALD}50`)}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = `${EMERALD}15`)}
                      >
                        <p className="font-inter text-sm font-bold" style={{ color: EMERALD }}>{a.full_name}</p>
                        <p className="font-inter text-xs mt-1" style={{ color: `${EMERALD}50` }}>
                          {a.line1}, {a.city}, {a.state} — {a.pincode}
                        </p>
                      </button>
                    ))}
                    <div className="pt-4" style={{ borderTop: `1px solid ${EMERALD}10` }}>
                      <p
                        className="font-inter text-xs tracking-[0.2em] uppercase mb-4"
                        style={{ color: `${EMERALD}40` }}
                      >
                        Or enter a new address
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[
                    { field: 'full_name', label: 'Full Name', placeholder: 'Your name', full: true },
                    { field: 'phone', label: 'Phone', placeholder: '+91 98765 43210', full: false },
                    { field: 'line1', label: 'Address Line 1', placeholder: 'Street / Apartment', full: true },
                    { field: 'line2', label: 'Address Line 2 (optional)', placeholder: 'Landmark etc.', full: true },
                    { field: 'city', label: 'City', placeholder: 'Hyderabad', full: false },
                    { field: 'state', label: 'State', placeholder: 'Telangana', full: false },
                    { field: 'pincode', label: 'Pincode', placeholder: '500001', full: false },
                  ].map(({ field, label, placeholder, full }) => (
                    <div key={field} className={full ? 'sm:col-span-2' : ''}>
                      <label
                        className="block font-inter text-[10px] tracking-[0.3em] uppercase mb-2"
                        style={{ color: `${EMERALD}60` }}
                      >
                        {label}
                      </label>
                      <input
                        type="text"
                        value={address[field as keyof Address]}
                        onChange={set(field as keyof Address)}
                        required={field !== 'line2'}
                        placeholder={placeholder}
                        className="w-full border-b py-2.5 font-inter text-sm bg-transparent outline-none transition-colors"
                        style={{ borderColor: `${EMERALD}20`, color: EMERALD }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = EMERALD)}
                        onBlur={(e) => (e.currentTarget.style.borderColor = `${EMERALD}20`)}
                      />
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 py-4 font-inter text-[11px] tracking-[0.4em] uppercase transition-all"
                  style={{ background: EMERALD, color: CREAM }}
                >
                  Continue to Review
                </button>
              </form>
            ) : (
              <div>
                <h2 className="font-bodoni font-bold text-xl mb-6" style={{ color: EMERALD }}>
                  Review Order
                </h2>

                <div className="border p-5 mb-6" style={{ borderColor: `${EMERALD}15` }}>
                  <p
                    className="font-inter text-xs tracking-[0.2em] uppercase mb-3"
                    style={{ color: `${EMERALD}40` }}
                  >
                    Shipping To
                  </p>
                  <p className="font-inter text-sm font-bold" style={{ color: EMERALD }}>
                    {address.full_name}
                  </p>
                  <p className="font-inter text-xs mt-1" style={{ color: `${EMERALD}55` }}>
                    {address.line1}{address.line2 ? `, ${address.line2}` : ''}<br />
                    {address.city}, {address.state} — {address.pincode}<br />
                    {address.phone}
                  </p>
                  <button
                    onClick={() => setStep('address')}
                    className="mt-3 font-inter text-xs underline underline-offset-2 transition-opacity hover:opacity-70"
                    style={{ color: EMERALD }}
                  >
                    Edit address
                  </button>
                </div>

                {error && (
                  <div className="border border-red-300 px-4 py-3 mb-4">
                    <p className="font-inter text-sm text-red-600">{error}</p>
                  </div>
                )}

                <button
                  onClick={handlePay}
                  disabled={loading}
                  className="w-full py-4 font-inter text-[11px] tracking-[0.4em] uppercase transition-all disabled:opacity-50"
                  style={{ background: EMERALD, color: CREAM }}
                >
                  {loading ? 'Opening payment…' : `Pay ₹${total.toLocaleString('en-IN')}`}
                </button>
              </div>
            )}
          </div>

          {/* Right — order summary */}
          <div className="lg:col-span-2">
            <h2 className="font-bodoni font-bold text-xl mb-6" style={{ color: EMERALD }}>
              Order Summary
            </h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-inter text-sm font-bold" style={{ color: EMERALD }}>{item.name}</p>
                    <p className="font-inter text-xs mt-0.5" style={{ color: `${EMERALD}45` }}>
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-inter text-sm" style={{ color: EMERALD }}>
                    ₹{(item.priceNum * item.quantity).toLocaleString('en-IN')}
                  </p>
                </div>
              ))}
            </div>
            <div
              className="mt-6 pt-6 flex justify-between"
              style={{ borderTop: `1px solid ${EMERALD}12` }}
            >
              <span
                className="font-inter text-xs tracking-[0.2em] uppercase"
                style={{ color: `${EMERALD}45` }}
              >
                Total
              </span>
              <span className="font-bodoni font-bold text-xl" style={{ color: EMERALD }}>
                ₹{total.toLocaleString('en-IN')}
              </span>
            </div>
            <p
              className="font-inter text-xs mt-4 leading-5"
              style={{ color: `${EMERALD}35` }}
            >
              Prices are in INR. Payment is secured via Razorpay.
              Your card details are never stored.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
