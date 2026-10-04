import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { fmt } from '../data'

export function useCountUp(target, ms = 1000, delay = 0) {
  const reduce = useReducedMotion()
  const [v, setV] = useState(reduce ? target : 0)
  useEffect(() => {
    if (reduce) { setV(target); return }
    let raf, t0
    const id = setTimeout(() => {
      const tick = (t) => { t0 ??= t; const p = Math.min((t - t0) / ms, 1); setV(target * (1 - (1 - p) ** 3)); if (p < 1) raf = requestAnimationFrame(tick) }
      raf = requestAnimationFrame(tick)
    }, delay)
    return () => { clearTimeout(id); cancelAnimationFrame(raf) }
  }, [target, ms, delay, reduce])
  return v
}

// Angka hero dengan count-up. Menghormati prefers-reduced-motion.
export function Hero({ value, decimals = 2, prefix = '', suffix = '', delay = 0, className = '' }) {
  const n = useCountUp(value, 1100, delay)
  return <span className={`hero-num ${className}`}>{prefix}{fmt(n, decimals)}{suffix}</span>
}

export default function KPI({ label, value, decimals = 1, suffix = '', unit, delay = 0, highlight, color }) {
  return (
    <motion.div className={`card kpi ${highlight ? 'hl' : ''}`} style={color ? { '--accent': color } : undefined}
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: delay / 1000 }}>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value"><Hero value={value} decimals={decimals} suffix={suffix} delay={delay} /></div>
      {unit && <div className="kpi-unit">{unit}</div>}
    </motion.div>
  )
}
