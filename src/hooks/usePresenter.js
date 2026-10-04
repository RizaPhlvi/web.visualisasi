import { useCallback, useEffect, useState } from 'react'

// Navigasi slide + langkah reveal + fullscreen yang selalu sinkron dengan browser.
export default function usePresenter(slides) {
  const [pos, setPos] = useState({ i: 0, step: 0, dir: 1 })
  const [present, setPresent] = useState(false)
  const last = slides.length - 1

  const next = useCallback(() => setPos(({ i, step }) =>
    step < slides[i].steps ? { i, step: step + 1, dir: 1 } : i < last ? { i: i + 1, step: 0, dir: 1 } : { i, step, dir: 1 }), [slides, last])
  const prev = useCallback(() => setPos(({ i, step }) =>
    step > 0 ? { i, step: step - 1, dir: -1 } : i > 0 ? { i: i - 1, step: slides[i - 1].steps, dir: -1 } : { i, step, dir: -1 }), [slides])
  const go = useCallback((n) => setPos((p) => ({ i: Math.max(0, Math.min(last, n)), step: 0, dir: n >= p.i ? 1 : -1 })), [last])

  const enter = useCallback(() => { setPresent(true); document.documentElement.requestFullscreen?.().catch(() => {}) }, [])
  const exit = useCallback(() => { setPresent(false); if (document.fullscreenElement) document.exitFullscreen?.() }, [])

  useEffect(() => { // Esc bawaan browser menutup fullscreen -> state ikut keluar
    const onFs = () => { if (!document.fullscreenElement) setPresent(false) }
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const k = e.key
      if (k === 'ArrowRight' || k === ' ' || k === 'PageDown') { e.preventDefault(); next() }
      else if (k === 'ArrowLeft' || k === 'PageUp') { e.preventDefault(); prev() }
      else if (k === 'Home') { e.preventDefault(); go(0) }
      else if (k === 'End') { e.preventDefault(); go(last) }
      else if (k === 'f' || k === 'F') { present ? exit() : enter() }
      else if (k === 'Escape' && present) exit()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev, go, enter, exit, present, last])

  return { ...pos, present, next, prev, go, enter, exit }
}
