export default function Navigation({ index, total, onPrev, onNext, onGo }) {
  return (
    <div className="nav">
      <button
        className="btn ghost nav-prev"
        onClick={onPrev}
        disabled={index === 0}
        aria-label="Slide sebelumnya"
      >
        ← Sebelumnya
      </button>

      <div className="nav-center">
        <div className="dots">
          {Array.from({ length: total }, (_, i) => (
            <button
              key={i}
              className={`dot ${i === index ? 'on' : ''}`}
              onClick={() => onGo(i)}
              aria-label={`Ke slide ${i + 1}`}
            />
          ))}
        </div>
        <span className="counter">{String(index + 1).padStart(2, '0')} / {total}</span>
      </div>

      <button
        className="btn ghost nav-next"
        onClick={onNext}
        disabled={index === total - 1}
        aria-label="Slide berikutnya"
      >
        Berikutnya →
      </button>
    </div>
  )
}
