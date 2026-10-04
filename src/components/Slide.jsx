import { SUMBER } from '../data'

// Satu slide = satu pesan. Judul berupa kalimat temuan; kicker menunjukkan peran slide dalam alur cerita.
export default function Slide({ no, kicker, title, children, className = '' }) {
  return (
    <section className={`slide ${className}`}>
      {title && (
        <header className="slide-head">
          <p className="kicker"><span>{String(no).padStart(2, '0')}</span>{kicker}</p>
          <h2>{title}</h2>
        </header>
      )}
      <div className="slide-body">{children}</div>
      <p className="source">{SUMBER}</p>
    </section>
  )
}
