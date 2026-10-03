import { useState, useEffect, useCallback } from 'react'
import Slide from './components/Slide'
import Header from './components/Header'
import Navigation from './components/Navigation'
import KPI from './components/KPI'
import MotionCard from './components/MotionCard'
import MagneticButton from './components/MagneticButton'
import { TrendLine, Donut, HBar, MonthBars, COLORS } from './components/Charts'
import { MONTHLY, GOLONGAN, TOP10, JUMLAH, fmt, stats } from './data'

const signed = (v) => `${v >= 0 ? '+' : '−'}${fmt(Math.abs(v))}%`
const bahanBaku = GOLONGAN.find((g) => g.golongan === 'Bahan Baku')
const byValue = [...GOLONGAN].sort((a, b) => b.nilai - a.nilai)
const sTotal = stats('total')

function Insight({ children, index = 0 }) {
  return <MotionCard className="card insight" index={index}><span className="tag">INSIGHT</span><p>{children}</p></MotionCard>
}

// Slide 6-8 memakai pola yang sama: line chart + ringkasan angka + insight
function GroupSlide({ no, title, dataKey, color, name, extra }) {
  const s = stats(dataKey)
  return (
    <Slide no={no} title={title}>
      <div className="split">
        <div className="card chart"><TrendLine data={MONTHLY} dataKey={dataKey} color={color} name={name} /></div>
        <div className="side">
          <MotionCard className="card mini" index={0}><span>Tertinggi · {s.maxBulan}</span><b>{fmt(s.max)}</b><small>juta US$</small></MotionCard>
          <MotionCard className="card mini" index={1}><span>Terendah · {s.minBulan}</span><b>{fmt(s.min)}</b><small>juta US$</small></MotionCard>
          <Insight index={2}>{extra ?? `Dari Januari ke Desember nilainya berubah ${signed(s.change)}.`}</Insight>
        </div>
      </div>
    </Slide>
  )
}

function buildSlides(next, restart) {
  return [
    () => (
      <Slide className="cover">
        <p className="eyebrow">PRESENTASI ANALISIS DATA</p>
        <h1>ANALISIS NILAI IMPOR INDONESIA 2025</h1>
        <h3>Menurut Golongan Barang Ekonomi</h3>
        <div className="meta"><span>Satuan: Juta US$</span><span>Periode: Januari–Desember 2025</span></div>
        <MagneticButton className="btn primary big" onClick={next}>Mulai Presentasi →</MagneticButton>
      </Slide>
    ),
    () => (
      <Slide no={2} title="Gambaran Umum Data">
        <div className="kpis">
          <KPI label="Total Impor" value={JUMLAH} unit="juta US$" index={0} />
          <KPI label="Rata-rata Bulanan" value={JUMLAH / 12} unit="juta US$" index={1} />
          <KPI label="Bulan Tertinggi" value={sTotal.maxBulan} sub="juta US$" subValue={sTotal.max} index={2} />
          <KPI label="Bulan Terendah" value={sTotal.minBulan} sub="juta US$" subValue={sTotal.min} index={3} />
        </div>
        <p className="lead">Data memuat nilai impor Indonesia tahun 2025 per bulan (Januari–Desember) menurut golongan barang ekonomi, dalam juta US$. Terdapat tiga golongan utama, yaitu Barang Konsumsi, Bahan Baku, dan Barang Modal, beserta kategori rincian di dalamnya.</p>
      </Slide>
    ),
    () => (
      <Slide no={3} title="Tren Total Nilai Impor 2025">
        <div className="split">
          <div className="card chart"><TrendLine data={MONTHLY} dataKey="total" name="Total Impor" /></div>
          <div className="side"><Insight index={0}>Nilai impor mengalami fluktuasi sepanjang 2025. Nilai tertinggi terjadi pada {sTotal.maxBulan} sebesar {fmt(sTotal.max)} juta US$, sedangkan nilai terendah terjadi pada {sTotal.minBulan} sebesar {fmt(sTotal.min)} juta US$.</Insight></div>
        </div>
      </Slide>
    ),
    () => (
      <Slide no={4} title="Komposisi Nilai Impor Berdasarkan Golongan">
        <div className="split">
          <div className="card chart"><Donut data={GOLONGAN} /></div>
          <div className="side">
            {GOLONGAN.map((g, i) => (
              <MotionCard className="card mini" key={g.golongan} index={i}><span><i className="swatch" style={{ background: [COLORS.purple, COLORS.cyan, COLORS.gold][i] }} />{g.golongan}</span><b>{fmt(g.persen, 2)}%</b><small>{fmt(g.nilai)} juta US$</small></MotionCard>
            ))}
            <Insight index={3}>Bahan Baku merupakan kelompok dengan kontribusi terbesar, yaitu sekitar {fmt(bahanBaku.persen, 2)}% dari total impor 2025.</Insight>
          </div>
        </div>
      </Slide>
    ),
    () => (
      <Slide no={5} title="Perbandingan Nilai Impor Golongan Utama">
        <div className="card chart full"><HBar data={byValue.map((g) => ({ ...g, nama: g.golongan }))} labelKey="golongan" yWidth={170} colors={[COLORS.cyan, COLORS.purple, COLORS.gold]} /></div>
      </Slide>
    ),
    () => <GroupSlide no={6} title="Pergerakan Impor Barang Konsumsi" dataKey="konsumsi" color={COLORS.gold} name="Barang Konsumsi" />,
    () => <GroupSlide no={7} title="Pergerakan Impor Bahan Baku" dataKey="bahanBaku" color={COLORS.cyan} name="Bahan Baku" extra={`Bahan Baku adalah kelompok terbesar dengan kontribusi sekitar ${fmt(bahanBaku.persen, 2)}% terhadap total impor 2025 (${fmt(bahanBaku.nilai)} juta US$).`} />,
    () => <GroupSlide no={8} title="Pergerakan Impor Barang Modal" dataKey="modal" color={COLORS.purple} name="Barang Modal" />,
    () => (
      <Slide no={9} title="10 Kategori Barang dengan Nilai Impor Tertinggi">
        <div className="card chart full"><HBar data={TOP10} labelKey="nama" yWidth={330} colors={[COLORS.cyan, ...Array(9).fill(COLORS.blue)]} /></div>
        <p className="note">Nilai tahunan, juta US$. Arahkan kursor ke bar untuk melihat golongan induk kategori.</p>
      </Slide>
    ),
    () => (
      <Slide no={10} title="Perbandingan Nilai Impor Antarbulan">
        <div className="card chart full"><MonthBars data={MONTHLY} dataKey="total" highlight={sTotal.maxBulan} /></div>
        <p className="note">{sTotal.maxBulan} (warna emas) adalah bulan dengan nilai impor tertinggi: {fmt(sTotal.max)} juta US$.</p>
      </Slide>
    ),
    () => (
      <Slide no={11} title="Insight Utama">
        <div className="cards5">
          {[
            ['01', 'Total impor Indonesia pada 2025', `${fmt(JUMLAH)} juta US$`],
            ['02', 'Bahan baku mendominasi impor', `${fmt(bahanBaku.nilai)} juta US$ / ${fmt(bahanBaku.persen, 2)}%`],
            ['03', 'Bulan dengan nilai impor tertinggi', `${sTotal.maxBulan} — ${fmt(sTotal.max)} juta US$`],
            ['04', 'Bulan dengan nilai impor terendah', `${sTotal.minBulan} — ${fmt(sTotal.min)} juta US$`],
            ['05', 'Kategori detail terbesar', `${TOP10[0].nama} — ${fmt(TOP10[0].nilai)} juta US$`],
          ].map(([n, t, v], i) => (
            <MotionCard className="card ins" key={n} index={i}><span className="ins-no">{n}</span><p>{t}</p><b>{v}</b></MotionCard>
          ))}
        </div>
      </Slide>
    ),
    () => (
      <Slide no={12} title="Kesimpulan" className="closing">
        <div className="big">{fmt(JUMLAH)}<small> juta US$</small></div>
        <p className="lead">Nilai impor Indonesia pada 2025 mencapai {fmt(JUMLAH)} juta US$. Struktur impor didominasi oleh Bahan Baku, diikuti Barang Modal dan Barang Konsumsi. Pergerakan bulanan mengalami fluktuasi dengan nilai tertinggi pada {sTotal.maxBulan} dan terendah pada {sTotal.minBulan}.</p>
        <MotionCard className="card takeaway" index={1}><span className="tag">TAKEAWAY</span><p>Dominasi Bahan Baku menunjukkan bahwa kelompok ini menjadi komponen utama dalam keseluruhan nilai impor 2025.</p></MotionCard>
        <MagneticButton className="btn primary" onClick={restart}>↻ Kembali ke Awal</MagneticButton>
      </Slide>
    ),
  ]
}

export default function App() {
  const [index, setIndex] = useState(0)
  const [present, setPresent] = useState(false)
  const last = 11
  const go = useCallback((i) => setIndex(Math.max(0, Math.min(last, i))), [])
  const next = useCallback(() => setIndex((i) => Math.min(last, i + 1)), [])
  const prev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), [])

  const enter = () => { setPresent(true); document.documentElement.requestFullscreen?.().catch(() => {}) }
  const exit = () => { setPresent(false); if (document.fullscreenElement) document.exitFullscreen?.() }

  useEffect(() => {
    const onKey = (e) => {
      const k = e.key
      if (k === 'ArrowRight' || k === ' ') { e.preventDefault(); next() }
      else if (k === 'ArrowLeft') { e.preventDefault(); prev() }
      else if (k === 'Home') go(0)
      else if (k === 'End') go(last)
      else if (k === 'f' || k === 'F') { present ? exit() : enter() }
      else if (k === 'Escape' && present) setPresent(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev, go, present])

  const slides = buildSlides(next, () => go(0))
  const Current = slides[index]
  return (
    <div className={`deck ${present ? 'present' : ''}`}>
      <div className="progress"><div style={{ width: `${((index + 1) / 12) * 100}%` }} /></div>
      <Header present={present} onPresent={enter} onExit={exit} />
      <main className="stage" key={index}><Current /></main>
      <Navigation index={index} total={12} onPrev={prev} onNext={next} onGo={go} />
    </div>
  )
}
