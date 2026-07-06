import { Smartphone, Monitor } from 'lucide-react'

interface Props {
  active: boolean
  onToggle: () => void
}

export default function ViewToggle({ active, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      title={active ? 'Switch to desktop view' : 'Preview mobile layout'}
      aria-label={active ? 'Switch to desktop view' : 'Preview mobile layout'}
      className="hidden md:flex fixed bottom-6 right-6 z-[200] w-12 h-12 items-center justify-center bg-[#1B3C34] text-[#FAF5E8] shadow-lg hover:bg-[#0D2A23] transition-colors duration-200 group"
    >
      {active
        ? <Monitor className="w-5 h-5" />
        : <Smartphone className="w-5 h-5" />
      }
      <span className="absolute right-14 top-1/2 -translate-y-1/2 whitespace-nowrap bg-[#1B3C34] text-[#FAF5E8] font-inter text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none">
        {active ? 'Desktop view' : 'Mobile view'}
      </span>
    </button>
  )
}
