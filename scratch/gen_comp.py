import json

with open('scratch/topo_paths.json', 'r') as f:
    paths = json.load(f)

with open('src/components/TopographicBackground.tsx', 'w') as f:
    f.write('''import React, { memo } from 'react'

const TopographicBackground = memo(function TopographicBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-80 md:opacity-100" style={{ transform: 'translateZ(0)' }}>
      <svg
        viewBox="0 0 1440 3800"
        preserveAspectRatio="xMidYMin slice"
        className="absolute top-0 left-0 w-full h-full text-[#1B3C34]"
        aria-hidden="true"
      >
        <g stroke="currentColor" strokeWidth="1" fill="none" strokeLinejoin="round" opacity="0.15">
''')
    for d in paths:
        f.write(f'          <path d="{d}" />\n')
    f.write('''        </g>
      </svg>
    </div>
  )
})

export default TopographicBackground
''')
