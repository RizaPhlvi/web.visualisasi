import { useMemo, useRef, useEffect } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Stage from './components/Stage'
import Chrome from './components/Chrome'
import usePresenter from './hooks/usePresenter'
import buildSlides from './slides'

// Transisi berarah: maju = geser dari kanan, mundur = dari kiri. Hanya fade jika reduced motion.
const variants = {
  enter: (d) => ({ opacity: 0, x: d * 60 }),
  center: { opacity: 1, x: 0 },
  exit: (d) => ({ opacity: 0, x: d * -60 }),
}

export default function App() {
  const api = useRef({})
  const slides = useMemo(() => buildSlides({ start: () => api.current.startDeck(), restart: () => api.current.go(0) }), [])
  const p = usePresenter(slides)
  const reduce = useReducedMotion()
  useEffect(() => { api.current = { go: p.go, startDeck: () => { p.enter(); p.next() } } })

  // Chrome hanya tampil sesaat setelah kursor bergerak saat presentasi.
  useEffect(() => {
    let t
    const show = () => { document.body.classList.add('moved'); clearTimeout(t); t = setTimeout(() => document.body.classList.remove('moved'), 2200) }
    addEventListener('mousemove', show)
    return () => { removeEventListener('mousemove', show); clearTimeout(t) }
  }, [])

  const Current = slides[p.i].render
  return (
    <div className={`deck ${p.present ? 'present' : ''}`}>
      <Stage>
        <AnimatePresence mode="wait" custom={p.dir} initial={false}>
          <motion.main key={p.i} className="stage" custom={p.dir} variants={reduce ? { enter: { opacity: 0 }, center: { opacity: 1 }, exit: { opacity: 0 } } : variants}
            initial="enter" animate="center" exit="exit" transition={{ duration: 0.28, ease: 'easeOut' }}>
            {Current(p.step)}
          </motion.main>
        </AnimatePresence>
      </Stage>
      <Chrome i={p.i} total={slides.length} present={p.present} onPrev={p.prev} onNext={p.next} onGo={p.go} onPresent={p.enter} onExit={p.exit} />
    </div>
  )
}
