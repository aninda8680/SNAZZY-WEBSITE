import { collections } from '../constants/collections'

const whatsappBase = 'https://wa.me/'
const whatsappNumber = '' // optional: add number in international format without + if needed

function getWhatsappLink(name: string) {
  const message = `I want this ${name} shirt`
  const encoded = encodeURIComponent(message)
  return whatsappNumber ? `${whatsappBase}${whatsappNumber}?text=${encoded}` : `${whatsappBase}?text=${encoded}`
}

export default function Shop() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-bodoni text-4xl md:text-5xl font-black mb-6">Shop All Collections</h1>
        <p className="font-inter text-sm text-white/60 mb-12">
          Browse all t-shirt collections and message us on WhatsApp to buy any item.
        </p>

        <div className="grid gap-8 md:grid-cols-2">
          {collections.map((col) => (
            <article
              key={col.number}
              className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-6 gap-4">
                <div>
                  <p className="font-inter text-xs uppercase tracking-[0.35em] text-white/40">Collection {col.number}</p>
                  <h2 className="font-bodoni text-3xl text-white mt-3">{col.name}</h2>
                </div>
                <div className="text-right text-sm font-inter text-white/60">₹1,499</div>
              </div>

              <div className="mb-6">
                <img src={col.image} alt={col.name} className="w-full rounded-[24px] object-cover" />
              </div>

              <p className="font-inter text-sm leading-7 text-white/70 mb-6">{col.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {col.specs.map((spec) => (
                  <div key={spec.label} className="rounded-3xl border border-white/10 p-4 bg-black/40">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-white/40">{spec.label}</p>
                    <p className="mt-2 font-bold text-sm text-white">{spec.value}</p>
                  </div>
                ))}
              </div>

              <a
                href={getWhatsappLink(col.name)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-xs font-bold uppercase tracking-[0.25em] text-black transition-all duration-300 hover:bg-white/90"
              >
                Buy on WhatsApp
              </a>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
