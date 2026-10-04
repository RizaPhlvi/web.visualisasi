import { motion } from 'framer-motion'

// Insight: angka/kalimat kunci besar + satu kalimat pendukung. Muncul saat `show` (reveal lewat keyboard).
export default function Insight({ show = true, big, children, label = 'Temuan' }) {
  return (
    <motion.aside className="card insight" initial={false} animate={{ opacity: show ? 1 : 0, y: show ? 0 : 12 }} transition={{ duration: 0.35 }} aria-hidden={!show}>
      <span className="tag">{label}</span>
      {big && <b className="insight-big">{big}</b>}
      <p>{children}</p>
    </motion.aside>
  )
}

export function Mini({ label, value, sub }) {
  return <div className="card mini"><span>{label}</span><b>{value}</b>{sub && <small>{sub}</small>}</div>
}

export function Legend({ items }) {
  return <ul className="legend">{items.map(([name, color]) => <li key={name}><i style={{ background: color }} />{name}</li>)}</ul>
}
