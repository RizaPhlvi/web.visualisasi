// Kontrol di luar kanvas: navigasi, progres, fullscreen. Di mode presentasi hanya muncul saat kursor digerakkan.
export default function Chrome({ i, total, present, onPrev, onNext, onGo, onPresent, onExit }) {
  return (
    <>
      <div className="progress" aria-hidden="true"><div style={{ width: `${((i + 1) / total) * 100}%` }} /></div>
      <div className="chrome top"><button className="btn ghost" onClick={present ? onExit : onPresent}>{present ? 'Keluar (Esc)' : 'Layar penuh (F)'}</button></div>
      <nav className="chrome bottom" aria-label="Navigasi slide">
        <button className="btn ghost" onClick={onPrev} disabled={i === 0} aria-label="Sebelumnya">← Sebelumnya</button>
        <div className="dots">
          {Array.from({ length: total }, (_, n) => <button key={n} className={`dot ${n === i ? 'on' : ''}`} onClick={() => onGo(n)} aria-label={`Ke slide ${n + 1}`} aria-current={n === i ? 'step' : undefined}><i /></button>)}
          <span className="counter" aria-live="polite">{String(i + 1).padStart(2, '0')} / {total}</span>
        </div>
        <button className="btn ghost" onClick={onNext} disabled={i === total - 1} aria-label="Berikutnya">Berikutnya →</button>
      </nav>
    </>
  )
}
