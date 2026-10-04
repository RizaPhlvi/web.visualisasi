import { useEffect, useState } from 'react'

// Kanvas tetap 1920x1080 yang diskalakan ke viewport (letterbox) -> tampilan sama di laptop & proyektor.
export default function Stage({ children }) {
  const [s, setS] = useState(1)
  useEffect(() => {
    const fit = () => setS(Math.min(innerWidth / 1920, innerHeight / 1080))
    fit()
    addEventListener('resize', fit)
    return () => removeEventListener('resize', fit)
  }, [])
  return <div className="viewport"><div className="canvas" style={{ transform: `translate(-50%,-50%) scale(${s})` }}>{children}</div></div>
}
