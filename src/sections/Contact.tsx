import { useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import { Instagram, Mail, MapPin } from 'lucide-react'

const fadeUp = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.7, ease: 'easeOut' } },
}

export default function Contact() {
  const [sent, setSent] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    formRef.current?.reset()
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <>
      {/* Contact section */}
      <section id="contact" className="bg-[#050505] py-24 md:py-36">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            ref={ref}
            variants={fadeUp}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="max-w-2xl mb-16"
          >
            <p className="font-inter text-xs tracking-[0.5em] uppercase text-amber-400 mb-6">
              Get In Touch
            </p>
            <h2 className="font-bodoni font-black text-5xl md:text-7xl text-white leading-tight">
              Start Your<br />
              <em className="italic text-white/50">Order</em>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Form */}
            <motion.form
              ref={formRef}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              transition={{ delay: 0.15 }}
              onSubmit={handleSubmit}
              className="flex flex-col gap-8"
            >
              <div className="flex flex-col gap-2">
                <label className="font-inter text-xs tracking-[0.3em] uppercase text-white/40">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your name"
                  className="bg-transparent border-b border-white/20 pb-3 text-white font-inter font-light placeholder:text-white/20 focus:outline-none focus:border-amber-400 transition-colors duration-300"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-inter text-xs tracking-[0.3em] uppercase text-white/40">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  className="bg-transparent border-b border-white/20 pb-3 text-white font-inter font-light placeholder:text-white/20 focus:outline-none focus:border-amber-400 transition-colors duration-300"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-inter text-xs tracking-[0.3em] uppercase text-white/40">
                  Collection Interest
                </label>
                <select
                  className="bg-transparent border-b border-white/20 pb-3 text-white/80 font-inter font-light focus:outline-none focus:border-amber-400 transition-colors duration-300 appearance-none"
                >
                  <option value="" className="bg-black">Select a collection</option>
                  <option value="pure-luxe" className="bg-black">Pure Luxe — Gold Thread</option>
                  <option value="bloom" className="bg-black">Bloom Series — Floral</option>
                  <option value="midnight" className="bg-black">Midnight Edge — Geometric</option>
                  <option value="earth" className="bg-black">Earth Roots — Heritage</option>
                  <option value="custom" className="bg-black">Custom Design</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-inter text-xs tracking-[0.3em] uppercase text-white/40">
                  Message
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell us about your vision..."
                  className="bg-transparent border-b border-white/20 pb-3 text-white font-inter font-light placeholder:text-white/20 focus:outline-none focus:border-amber-400 transition-colors duration-300 resize-none"
                />
              </div>

              <button
                type="submit"
                className="mt-4 font-inter font-bold text-xs tracking-[0.25em] uppercase px-10 py-4 bg-white text-black rounded-full hover:scale-105 transition-transform duration-300 self-start"
              >
                {sent ? 'Message Sent ✓' : 'Send Message'}
              </button>
            </motion.form>

            {/* Info */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              transition={{ delay: 0.3 }}
              className="flex flex-col gap-12"
            >
              <div>
                <p className="font-bodoni italic text-3xl md:text-4xl text-white/70 leading-relaxed mb-8">
                  "Wear something the world has never seen before."
                </p>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4 text-white/50">
                  <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span className="font-inter font-light text-sm">hello@snazzy.co</span>
                </div>
                <div className="flex items-center gap-4 text-white/50">
                  <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span className="font-inter font-light text-sm">Hyderabad, India</span>
                </div>
                <div className="flex items-center gap-4 text-white/50">
                  <Instagram className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span className="font-inter font-light text-sm">@snazzy.embroidery</span>
                </div>
              </div>

              <div className="border border-white/10 rounded-sm p-8">
                <p className="font-inter text-xs tracking-[0.3em] uppercase text-amber-400 mb-4">
                  Custom Orders
                </p>
                <p className="font-inter font-light text-white/60 text-sm leading-7">
                  Have a design in mind? We bring it to life. Minimum order of 10 pieces for custom
                  embroidery. Samples available within 7 working days.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-bodoni text-lg tracking-[0.3em] text-white font-bold">SNAZZY</p>
          <div className="flex items-center gap-8 font-inter text-xs tracking-[0.2em] uppercase text-white/40">
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">Journal</a>
            <a href="#" className="hover:text-white transition-colors">Legal</a>
          </div>
          <p className="font-inter text-xs text-white/30">
            © {new Date().getFullYear()} SNAZZY. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  )
}
