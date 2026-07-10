import { useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import { Instagram, Mail, MapPin, MessageCircle } from 'lucide-react'

const fadeUp = {
  hidden: { y: 24, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.65, ease: 'easeOut' } },
}

export default function Contact() {
  const [sent, setSent] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: true })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    formRef.current?.reset()
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <>
      <section id="contact" className="bg-[#FAF5E8] md:bg-white py-20 md:py-36 border-t border-[#1B3C34]/10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-8">

          {/* Heading */}
          <motion.div
            ref={ref}
            variants={fadeUp}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="mb-6 md:mb-16"
          >
            <p className="font-inter text-[10px] tracking-[0.4em] md:tracking-[0.5em] uppercase text-[#1B3C34]/35 mb-4">
              Get In Touch
            </p>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-[#1B3C34]/10 pb-6">
              <h2 className="font-inter font-light text-[1.6rem] md:text-5xl text-[#1B3C34] leading-tight tracking-tight">
                Start Your Order
              </h2>
              <p className="font-inter text-xs text-[#1B3C34]/35 tracking-wide">
                We'll get back to you within 24 hours.
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">

            {/* Form */}
            <motion.form
              ref={formRef}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              transition={{ delay: 0.1 }}
              onSubmit={handleSubmit}
              className="flex flex-col gap-8 md:gap-8"
            >
              <div className="flex flex-col gap-2">
                <label className="font-inter text-[10px] tracking-[0.4em] uppercase text-[#1B3C34]/40">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your name"
                  className="bg-transparent border-b border-[#1B3C34]/15 pt-3 pb-3 md:pt-0 text-[#1B3C34] font-inter font-light text-sm placeholder:text-[#1B3C34]/20 focus:outline-none focus:border-[#1B3C34] transition-colors duration-300"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-inter text-[10px] tracking-[0.4em] uppercase text-[#1B3C34]/40">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  className="bg-transparent border-b border-[#1B3C34]/15 pt-3 pb-3 md:pt-0 text-[#1B3C34] font-inter font-light text-sm placeholder:text-[#1B3C34]/20 focus:outline-none focus:border-[#1B3C34] transition-colors duration-300"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-inter text-[10px] tracking-[0.4em] uppercase text-[#1B3C34]/40">
                  Collection Interest
                </label>
                <select
                  className="bg-transparent border-b border-[#1B3C34]/15 pt-3 pb-3 md:pt-0 text-[#1B3C34]/70 font-inter font-light text-sm focus:outline-none focus:border-[#1B3C34] transition-colors duration-300 appearance-none"
                >
                  <option value="" className="bg-white text-[#1B3C34]">Select a collection</option>
                  <option value="pure-luxe" className="bg-white text-[#1B3C34]">Pure Luxe — Gold Thread</option>
                  <option value="bloom" className="bg-white text-[#1B3C34]">Bloom Series — Floral</option>
                  <option value="midnight" className="bg-white text-[#1B3C34]">Midnight Edge — Geometric</option>
                  <option value="earth" className="bg-white text-[#1B3C34]">Earth Roots — Heritage</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-inter text-[10px] tracking-[0.4em] uppercase text-[#1B3C34]/40">
                  Message
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell us about your vision..."
                  className="bg-transparent border-b border-[#1B3C34]/15 pt-3 pb-3 md:pt-0 text-[#1B3C34] font-inter font-light text-sm placeholder:text-[#1B3C34]/20 focus:outline-none focus:border-[#1B3C34] transition-colors duration-300 resize-none"
                />
              </div>

              <button
                type="submit"
                className="mt-2 font-inter text-[11px] tracking-[0.3em] uppercase px-10 py-4 bg-[#1B3C34] text-white hover:bg-[#0D2A23] transition-colors w-full sm:w-auto sm:self-start"
              >
                {sent ? 'Message Sent ✓' : 'Send Message'}
              </button>
            </motion.form>

            {/* Info */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              transition={{ delay: 0.2 }}
              className="flex flex-col gap-8 pt-10 mt-4 border-t border-[#1B3C34]/10 lg:border-0 lg:pt-0 lg:mt-0"
            >
              <p className="font-inter font-light italic text-lg md:text-3xl text-[#1B3C34]/40 leading-relaxed">
                "Wear something the world has never seen before."
              </p>

              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-4 min-h-[44px] md:min-h-0 text-gray-500 md:text-[#1B3C34]/40">
                  <MapPin className="w-4 h-4 text-[#1B3C34]/30 flex-shrink-0" />
                  <span className="font-inter font-light text-sm">Vizianagram, India</span>
                </div>
                <div className="flex items-center gap-4 min-h-[44px] md:min-h-0 text-gray-500 md:text-[#1B3C34]/40">
                  <Mail className="w-4 h-4 text-[#1B3C34]/30 flex-shrink-0" />
                  <a href="mailto:snazzydot.co@gmail.com" className="font-inter font-light text-sm hover:text-[#1B3C34] transition-colors">
                    snazzydot.co@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-4 min-h-[44px] md:min-h-0 text-gray-500 md:text-[#1B3C34]/40">
                  <Instagram className="w-4 h-4 text-[#1B3C34]/30 flex-shrink-0" />
                  <a href="https://instagram.com/snazzy.dot" target="_blank" rel="noopener noreferrer" className="font-inter font-light text-sm hover:text-[#1B3C34] transition-colors">
                    @snazzy.dot
                  </a>
                </div>
                <div className="flex items-center gap-4 min-h-[44px] md:min-h-0 text-gray-500 md:text-[#1B3C34]/40">
                  <MessageCircle className="w-4 h-4 text-[#1B3C34]/30 flex-shrink-0" />
                  <a href="https://wa.me/916281113614" target="_blank" rel="noopener noreferrer" className="font-inter font-light text-sm hover:text-[#1B3C34] transition-colors">
                    +91 6281113614
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1B3C34] py-10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-inter text-sm tracking-[0.4em] text-white/80 uppercase">SNAZZY.</p>
          <div className="flex items-center gap-8 font-inter text-[10px] tracking-[0.25em] uppercase text-white/30">
            <a href="https://instagram.com/snazzy.dot" target="_blank" rel="noopener noreferrer" className="hover:text-white/70 transition-colors">Instagram</a>
            <a href="#" className="hover:text-white/70 transition-colors">Journal</a>
            <a href="#" className="hover:text-white/70 transition-colors">Legal</a>
          </div>
          <p className="font-inter text-[10px] text-white/25 tracking-wide">
            © {new Date().getFullYear()} SNAZZY. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  )
}

