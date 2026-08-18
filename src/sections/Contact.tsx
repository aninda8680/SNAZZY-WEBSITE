import { useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { motion, AnimatePresence } from 'framer-motion'
import { Instagram, Mail, MapPin, MessageCircle, ArrowRight } from 'lucide-react'

// ─── Animation Variants ───────────────────────────────────────────────────────

const fadeUp = (delay = 0) => ({
  hidden:  { y: 32, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay } },
})

// ─── Field Component ──────────────────────────────────────────────────────────

function Field({
  label,
  type = 'text',
  placeholder,
  required,
  as,
  rows,
}: {
  label: string
  type?: string
  placeholder: string
  required?: boolean
  as?: 'textarea'
  rows?: number
}) {
  const [focused, setFocused] = useState(false)
  const sharedClass =
    'w-full bg-transparent pt-3 pb-2 font-inter font-medium text-sm text-[#1B3C34] placeholder:text-[#1B3C34]/60 focus:outline-none resize-none'

  return (
    <div className="flex flex-col gap-1.5 group">
      <label
        className={`font-inter font-semibold text-[10px] tracking-[0.45em] uppercase transition-colors duration-300 ${
          focused ? 'text-[#1B3C34]' : 'text-[#1B3C34]/70'
        }`}
      >
        {label}
      </label>

      {as === 'textarea' ? (
        <textarea
          rows={rows ?? 4}
          placeholder={placeholder}
          required={required}
          className={sharedClass}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          required={required}
          className={sharedClass}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      )}

      {/* Animated underline */}
      <div className="relative h-px bg-[#1B3C34]/30">
        <div
          className="absolute inset-0 bg-[#1B3C34] origin-left transition-transform duration-400 ease-out"
          style={{ transform: focused ? 'scaleX(1)' : 'scaleX(0)' }}
        />
      </div>
    </div>
  )
}

// ─── Contact Detail Row ────────────────────────────────────────────────────────

function ContactRow({
  icon: Icon,
  href,
  children,
  external,
}: {
  icon: React.ElementType
  href?: string
  children: React.ReactNode
  external?: boolean
}) {
  const inner = (
    <div className="flex items-center gap-4 group/row py-3 border-b border-[#1B3C34]/10 last:border-0">
      <span className="w-8 h-8 flex-shrink-0 flex items-center justify-center border border-[#1B3C34]/15 group-hover/row:border-[#1B3C34]/40 transition-colors duration-300">
        <Icon className="w-3.5 h-3.5 text-[#1B3C34]/50 group-hover/row:text-[#1B3C34] transition-colors duration-300" />
      </span>
      <span className="font-inter text-sm text-[#1B3C34]/65 group-hover/row:text-[#1B3C34] transition-colors duration-300 tracking-wide">
        {children}
      </span>
      <ArrowRight className="w-3 h-3 text-[#1B3C34]/20 group-hover/row:text-[#1B3C34]/50 ml-auto transition-all duration-300 group-hover/row:translate-x-0.5" />
    </div>
  )

  if (href) {
    return (
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className="block"
      >
        {inner}
      </a>
    )
  }
  return <div>{inner}</div>
}

// ─── Main Component ────────────────────────────────────────────────────────────

type SubmitState = 'idle' | 'sending' | 'sent'

export default function Contact() {
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const formRef = useRef<HTMLFormElement>(null)
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitState('sending')
    setTimeout(() => {
      setSubmitState('sent')
      formRef.current?.reset()
      setTimeout(() => setSubmitState('idle'), 4000)
    }, 1400)
  }

  return (
    <>
      {/* ── Contact Section ────────────────────────────────────────────────── */}
      <section id="contact" className="relative bg-[#FAF5E8] overflow-hidden min-h-screen flex items-center">

        {/* Subtle background texture — faint grid lines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: `
              linear-gradient(#1B3C34 1px, transparent 1px),
              linear-gradient(90deg, #1B3C34 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />

        {/* Top border accent */}
        <div className="absolute top-0 left-0 right-0 h-px w-full bg-[#1B3C34]/10" />

        <div ref={ref} className="relative w-full max-w-[1400px] mx-auto px-6 md:px-8 py-16 md:py-20">

          {/* ── Section Label ── */}
          <motion.div
            variants={fadeUp(0)}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="mb-8 md:mb-12"
          >
            <p className="font-inter text-[9px] tracking-[0.5em] uppercase text-[#1B3C34]/40 mb-5">
              Get In Touch
            </p>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
              <h2 className="font-cormorant font-bold text-4xl md:text-6xl text-[#1B3C34] uppercase leading-none tracking-wide">
                Start a<br className="hidden md:block" /> Conversation
              </h2>
              <p className="font-inter text-xs text-[#1B3C34]/50 tracking-wide max-w-xs leading-relaxed">
                Whether it's a custom order, a press enquiry,<br className="hidden md:block" /> or just a word — we're here.
              </p>
            </div>
            {/* Ruled line */}
            <div className="mt-8 h-px bg-[#1B3C34]/10" />
          </motion.div>

          {/* ── Two-Column Split ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-16 lg:gap-24 items-start">

            {/* LEFT — Brand presence */}
            <motion.div
              variants={fadeUp(0.1)}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className="flex flex-col gap-10"
            >
              {/* Quote */}
              <div className="relative pl-6 border-l-2 border-[#1B3C34]/20">
                <p className="font-bodoni italic text-2xl md:text-3xl text-[#1B3C34] leading-snug">
                  "Wear something the world<br /> has never seen before."
                </p>
              </div>

              {/* Supporting copy */}
              <p className="font-inter text-sm text-[#1B3C34]/60 leading-7 tracking-wide max-w-sm">
                Every piece in our catalogue starts with a conversation. Tell us about your idea and
                we'll bring it to life — stitch by stitch.
              </p>

              {/* Contact details */}
              <div className="flex flex-col">
                <ContactRow icon={MapPin}>
                  Vizianagram, India
                </ContactRow>
                <ContactRow icon={Mail} href="mailto:snazzydot.co@gmail.com">
                  snazzydot.co@gmail.com
                </ContactRow>
                <ContactRow icon={Instagram} href="https://instagram.com/snazzy.dot" external>
                  @snazzy.dot
                </ContactRow>
                <ContactRow icon={MessageCircle} href="https://wa.me/916281113614" external>
                  +91 6281113614
                </ContactRow>
              </div>

              {/* Response time note */}
              <p className="font-inter text-[10px] tracking-[0.3em] uppercase text-[#1B3C34]/35 border-t border-[#1B3C34]/10 pt-6">
                We respond within 24 hours
              </p>
            </motion.div>

            {/* RIGHT — Form */}
            <motion.form
              ref={formRef}
              variants={fadeUp(0.2)}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              onSubmit={handleSubmit}
              className="flex flex-col gap-7"
            >
              {/* Name + Email side by side on tablet+ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                <Field label="Full Name" placeholder="Your name" required />
                <Field label="Email Address" type="email" placeholder="your@email.com" required />
              </div>

              <Field label="Subject" placeholder="Custom order / Press / Other" />

              <Field
                label="Message"
                placeholder="Tell us about your vision…"
                as="textarea"
                rows={5}
              />

              {/* Submit button */}
              <div className="flex items-center justify-between gap-6 pt-2">
                <button
                  type="submit"
                  disabled={submitState !== 'idle'}
                  className="relative group overflow-hidden font-inter text-[10px] tracking-[0.4em] uppercase px-10 py-4 border border-[#1B3C34] text-[#1B3C34] transition-colors duration-300 hover:text-[#FAF5E8] disabled:opacity-60 flex items-center gap-3 min-w-[180px] justify-center"
                >
                  {/* Fill sweep on hover */}
                  <span className="absolute inset-0 bg-[#1B3C34] -translate-x-full group-hover:translate-x-0 transition-transform duration-400 ease-out" />

                  <AnimatePresence mode="wait">
                    {submitState === 'idle' && (
                      <motion.span
                        key="idle"
                        className="relative flex items-center gap-3"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        Send Message
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </motion.span>
                    )}
                    {submitState === 'sending' && (
                      <motion.span
                        key="sending"
                        className="relative flex items-center gap-2"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin" />
                        Sending…
                      </motion.span>
                    )}
                    {submitState === 'sent' && (
                      <motion.span
                        key="sent"
                        className="relative"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        Message Sent ✓
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>

                <p className="font-inter text-[9px] tracking-wide text-[#1B3C34]/60 leading-relaxed hidden sm:block">
                  No spam. Ever.<br />Your data stays with us.
                </p>
              </div>
            </motion.form>

          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="bg-[#1B3C34]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-5">
          <p className="font-inter text-sm tracking-[0.45em] text-white/80 uppercase">SNAZZY.</p>
          <div className="flex items-center gap-8 font-inter text-[9px] tracking-[0.3em] uppercase text-white/35">
            <a href="https://instagram.com/snazzy.dot" target="_blank" rel="noopener noreferrer" className="hover:text-white/70 transition-colors duration-200">Instagram</a>
            <a href="#" className="hover:text-white/70 transition-colors duration-200">Journal</a>
            <a href="#" className="hover:text-white/70 transition-colors duration-200">Legal</a>
          </div>
          <p className="font-inter text-[9px] text-white/25 tracking-wide">
            © {new Date().getFullYear()} SNAZZY. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  )
}
