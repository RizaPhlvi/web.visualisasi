import { useEffect, useState } from 'react'
import { fmt } from '../data'
import MotionCard from './MotionCard'

// Angka naik dari 0 ke nilai akhir (count-up). Jika value berupa teks, ditampilkan apa adanya.
function useCountUp(target, ms = 900) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (typeof target !== 'number') return
    let raf, start
    const tick = (t) => {
      start ??= t
      const p = Math.min((t - start) / ms, 1)
      setV(target * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, ms])
  return v
}

export default function KPI({ label, value, unit, sub, subValue, index = 0 }) {
  const n = useCountUp(value)
  const s = useCountUp(subValue)
  return (
    <MotionCard className="card kpi" index={index} tilt>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{typeof value === 'number' ? fmt(n) : value}</div>
      {unit && <div className="kpi-unit">{unit}</div>}
      {sub && <div className="kpi-sub">{typeof subValue === 'number' ? `${fmt(s)} ${sub}` : sub}</div>}
    </MotionCard>
  )
}
