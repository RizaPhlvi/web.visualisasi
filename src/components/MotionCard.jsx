import { motion, useReducedMotion } from 'framer-motion'
import Tilt from 'react-parallax-tilt'

// Kartu yang muncul dari bawah ke atas. `index` menentukan urutan (jeda 0,1 detik per kartu).
// tilt=true menambahkan efek miring 3D + glare. Tilt dipasang di LUAR agar tetap menjadi anak langsung CSS Grid.
export default function MotionCard({ index = 0, className = 'card', tilt = false, children, ...rest }) {
  const reduce = useReducedMotion()
  const card = (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
      {...rest}
    >
      {children}
    </motion.div>
  )
  if (!tilt || reduce) return card
  return (
    <Tilt className="tilt-wrap" tiltMaxAngleX={8} tiltMaxAngleY={8} perspective={900} scale={1.02}
      glareEnable glareMaxOpacity={0.22} glareColor="#22d3ee" glareBorderRadius="18px" transitionSpeed={1200}>
      {card}
    </Tilt>
  )
}
