// Pembungkus satu slide: judul + isi. key pada App membuat animasi diputar ulang tiap pindah slide.
export default function Slide({ no, title, children, className = '' }) {
  return (
    <section className={`slide ${className}`}>
      {title && (
        <header className="slide-head">
          <span className="slide-no">{String(no).padStart(2, '0')}</span>
          <h2>{title}</h2>
        </header>
      )}
      <div className="slide-body">{children}</div>
    </section>
  )
}
