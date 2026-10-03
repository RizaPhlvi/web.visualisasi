export default function Header({ present, onPresent, onExit }) {
  return (
    <div className="topbar">
      <span className="brand">IMPOR INDONESIA 2025</span>
      {present ? (
        <button className="btn ghost" onClick={onExit}>Exit Presentation</button>
      ) : (
        <button className="btn ghost" onClick={onPresent}>Presentation Mode</button>
      )}
    </div>
  )
}
