import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import bgImage from '../../assets/baground.png'

const pillars = [
  { label: 'Thoughtful Design',    desc: 'Every detail has a purpose — from thread count to stitch direction.' },
  { label: 'Quality Materials',    desc: 'Chosen for feel and durability across hundreds of washes.' },
  { label: 'Expert Craftsmanship', desc: 'Stitched with precision on professional 6-head embroidery machines.' },
  { label: 'Built to Last',        desc: 'Made to be worn hard and worn often. Made to stay.' },
]

const steps = [
  { num: '01', title: 'Design',  desc: 'Every piece starts as a digital sketch — colors, stitch paths, and thread counts mapped to the millimetre.' },
  { num: '02', title: 'Thread',  desc: 'We source only premium polyester, rayon, and metallic threads — 300+ shades available on demand.' },
  { num: '03', title: 'Stitch',  desc: 'Our 6-head machines run at 800 stitches per minute. A single complex design can take 6 hours.' },
  { num: '04', title: 'Finish',  desc: 'Every garment is hand-trimmed, quality-checked, and steam-pressed before it earns the SNAZZY label.' },
]

export default function About() {
  return (
    <div className="bg-[#FAF5E8]">

      {/* ── Top nav bar ── */}
      <div className="sticky top-0 z-40 bg-[#FAF5E8] border-b border-[#1B3C34]/10 flex items-center justify-between px-5 h-14">
        <Link to="/" className="flex items-center gap-2 text-[#1B3C34]/50 active:opacity-60">
          <ArrowLeft className="w-4 h-4" />
          <span className="font-inter text-[10px] tracking-[0.25em] uppercase">Back</span>
        </Link>
        <span className="font-inter text-[10px] tracking-[0.45em] uppercase text-[#1B3C34]/40">Our Story</span>
        <Link to="/#shop" className="font-inter text-[10px] tracking-[0.25em] uppercase text-[#1B3C34]/50 active:opacity-60">
          Shop
        </Link>
      </div>

      {/* ── HERO — full viewport, dark emerald ── */}
      <section
        className="relative flex flex-col justify-end overflow-hidden"
        style={{ minHeight: '100svh', background: 'linear-gradient(170deg, #061210 0%, #1B3C34 55%, #0A1E18 100%)' }}
      >
        {/* Giant background letterform */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <span className="font-bodoni font-black select-none"
            style={{ fontSize: '95vw', lineHeight: 0.85, color: 'rgba(250,245,232,0.03)', letterSpacing: '-0.04em' }}>
            S
          </span>
        </div>

        {/* Horizontal rule */}
        <div className="absolute top-0 left-0 right-0 h-px bg-white/10" />

        {/* Content — bottom-anchored */}
        <div className="relative z-10 px-6 pb-14 pt-20">
          <p className="font-inter text-[9px] tracking-[0.6em] uppercase text-white/35 mb-6">
            Snazzy — Est. 2024
          </p>
          <h1 className="font-bodoni font-black leading-[0.9] uppercase mb-8"
            style={{ fontSize: 'clamp(2.4rem, 13vw, 5rem)', color: '#FAF5E8' }}>
            Crafted<br />to Be<br />
            <span style={{ color: 'rgba(250,245,232,0.45)' }}>Remembered.</span>
          </h1>
          <p className="font-inter font-light text-[13px] leading-[1.9] text-white/45 max-w-xs mb-10">
            Premium embroidered streetwear — produced in limited quantities, every piece
            made to last and made to say something.
          </p>
          <a href="#brand"
            className="inline-flex items-center gap-3 font-inter text-[10px] tracking-[0.4em] uppercase py-4 px-7 bg-[#FAF5E8] text-[#1B3C34] active:opacity-80">
            Read Our Story
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Bottom rule */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />
      </section>

      {/* ── BRAND IMAGE — full bleed ── */}
      <div className="relative w-full overflow-hidden" style={{ height: '88vw' }}>
        <img src={bgImage} alt="Snazzy embroidered garment"
          className="absolute inset-0 w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-[#1B3C34]/20" />
        <div className="absolute bottom-0 left-0 right-0 h-24"
          style={{ background: 'linear-gradient(to top, #FAF5E8, transparent)' }} />
      </div>

      {/* ── BRAND STORY — cream ── */}
      <section id="brand" className="px-6 py-14 border-b border-[#1B3C34]/10">
        <p className="font-inter text-[9px] tracking-[0.55em] uppercase text-[#1B3C34]/35 mb-5">
          Premium Embroidered Streetwear
        </p>
        <h2 className="font-bodoni text-[2.2rem] leading-[1.05] tracking-tight uppercase text-[#1B3C34] mb-6">
          Who We Are
        </h2>
        <div className="w-8 h-px bg-[#1B3C34]/20 mb-7" />
        <p className="font-inter font-light text-[14px] leading-[1.95] text-[#1B3C34]/60 mb-4">
          SNAZZY was born out of frustration with fast fashion — clothing with no soul,
          no craft, no permanence. We set out to build the opposite.
        </p>
        <p className="font-inter font-light text-[14px] leading-[1.95] text-[#1B3C34]/60 mb-10">
          Every piece is thoughtfully embroidered, produced in limited quantities,
          and created to celebrate craftsmanship over convenience.
        </p>
        <Link to="/#shop"
          className="inline-flex items-center gap-3 font-inter text-[10px] tracking-[0.4em] uppercase py-4 px-7 bg-[#1B3C34] text-[#FAF5E8] active:opacity-80">
          Shop Collection
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </section>

      {/* ── OUR VALUES — dark emerald ── */}
      <section style={{ background: '#1B3C34' }}>
        <div className="px-6 pt-12 pb-8">
          <p className="font-inter text-[9px] tracking-[0.55em] uppercase text-white/30 mb-4">
            What We Stand For
          </p>
          <h2 className="font-bodoni text-[2rem] leading-tight tracking-tight uppercase text-white/90">
            Our Values
          </h2>
        </div>

        <div className="divide-y divide-white/10">
          {pillars.map((item, i) => (
            <div key={item.label} className="flex items-start gap-5 px-6 py-7">
              <span className="flex-shrink-0 font-inter text-[11px] font-bold text-white/20 w-6 pt-0.5 tabular-nums">
                0{i + 1}
              </span>
              <div>
                <p className="font-inter font-semibold text-[13.5px] tracking-wide text-white/85 mb-2">
                  {item.label}
                </p>
                <p className="font-inter text-[12.5px] leading-[1.8] text-white/45">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── THE PROCESS — cream ── */}
      <section className="bg-[#FAF5E8]">
        <div className="px-6 pt-14 pb-8 border-b border-[#1B3C34]/10">
          <p className="font-inter text-[9px] tracking-[0.55em] uppercase text-[#1B3C34]/35 mb-4">
            The Process
          </p>
          <h2 className="font-bodoni text-[2rem] leading-tight tracking-tight uppercase text-[#1B3C34]">
            Unseen Precision
          </h2>
        </div>

        <div className="divide-y divide-[#1B3C34]/10">
          {steps.map((step, i) => (
            <div key={step.num} className="relative overflow-hidden px-6 py-9">
              {/* Watermark */}
              <span className="absolute right-3 top-1/2 -translate-y-1/2 font-bodoni font-black leading-none select-none pointer-events-none"
                style={{ fontSize: '28vw', color: 'rgba(27,60,52,0.05)' }}>
                {i + 1}
              </span>

              <div className="relative z-10 flex items-start gap-5">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1B3C34] text-[#FAF5E8] font-inter text-[10px] font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-bodoni text-[1.4rem] leading-tight tracking-tight uppercase text-[#1B3C34] mb-3">
                    {step.title}
                  </h3>
                  <p className="font-inter text-[13px] leading-[1.85] text-[#1B3C34]/55 max-w-[270px]">
                    {step.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── QUOTE — dark emerald ── */}
      <section className="flex flex-col items-center justify-center px-8 py-16 text-center"
        style={{ background: '#1B3C34' }}>
        <div className="w-8 h-px bg-white/20 mb-8" />
        <blockquote className="font-bodoni italic text-[1.5rem] leading-[1.5] text-white/80 mb-6 max-w-xs">
          "Every stitch is a decision. Every thread is a commitment."
        </blockquote>
        <p className="font-inter text-[9px] tracking-[0.5em] uppercase text-white/30">
          — SNAZZY Craft Philosophy
        </p>
        <div className="w-8 h-px bg-white/20 mt-8" />
      </section>

      {/* ── FINAL CTA — cream ── */}
      <section className="px-6 py-14 flex flex-col items-center text-center gap-6">
        <p className="font-inter text-[10px] tracking-[0.4em] uppercase text-[#1B3C34]/40">
          Ready to wear something unforgettable?
        </p>
        <h3 className="font-bodoni text-[1.8rem] leading-tight text-[#1B3C34] uppercase">
          Shop the<br />Collection
        </h3>
        <Link to="/#shop"
          className="w-full flex items-center justify-center gap-3 font-inter font-bold text-[10px] tracking-[0.4em] uppercase py-5 bg-[#1B3C34] text-[#FAF5E8] active:opacity-80">
          Explore Now
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* Footer */}
      <div className="border-t border-[#1B3C34]/10 px-6 py-6 flex items-center justify-between">
        <span className="font-inter text-[9px] tracking-[0.4em] uppercase text-[#1B3C34]/30">
          SNAZZY
        </span>
        <span className="font-inter text-[9px] text-[#1B3C34]/25">
          © {new Date().getFullYear()} Vizianagram, India
        </span>
      </div>

    </div>
  )
}
