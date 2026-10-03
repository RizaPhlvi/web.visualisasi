import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

// Tombol "menarik" kursor: saat kursor berada dalam radius tertentu, tombol bergeser mendekatinya.
export default function MagneticButton({ children, className = 'btn', radius = 110, strength = 0.35, disabled, ...rest }) {
  const ref = useRef(null)
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 16 })
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 16 })

  useEffect(() => {
    const onMove = (e) => {
      const el = ref.current
      if (!el || disabled) return
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      const near = Math.hypot(dx, dy) < radius + Math.max(r.width, r.height) / 2
      x.set(near ? dx * strength : 0)
      y.set(near ? dy * strength : 0)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [disabled, radius, strength, x, y])

  return (
    <motion.button ref={ref} className={className} style={{ x, y }} whileTap={{ scale: 0.95 }} disabled={disabled} {...rest}>
      {children}
    </motion.button>
  )
}
