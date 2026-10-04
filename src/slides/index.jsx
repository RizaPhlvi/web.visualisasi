import Slide from '../components/Slide'
import KPI, { Hero } from '../components/KPI'
import Insight, { Mini, Legend } from '../components/Insight'
import { TrendLine, Donut, HBar, StackedMonths } from '../components/Charts'
import { MONTHLY, GOLONGAN, TOP10, JUMLAH, fmt, stats } from '../data'
import { C, GROUP, M } from '../theme'

// Semua angka turunan dihitung dari data.js (tidak ada angka baru).
const signed = (v) => `${v >= 0 ? '+' : '−'}${fmt(Math.abs(v))}%`
const g = (n) => GOLONGAN.find((x) => x.golongan === n)
const BB = g('Bahan Baku'), MD = g('Barang Modal'), KS = g('Barang Konsumsi')
const sT = stats('total'), sK = stats('konsumsi'), sB = stats('bahanBaku'), sM = stats('modal')
const byValue = [...GOLONGAN].sort((a, b) => b.nilai - a.nilai).map((x) => ({ ...x, nama: x.golongan }))
const top10Sum = TOP10.reduce((a, t) => a + t.nilai, 0)
const top10Pct = (top10Sum / JUMLAH) * 100
const top1Pct = (TOP10[0].nilai / JUMLAH) * 100
const total = M(JUMLAH)

const ends = (s, key) => [{ bulan: s.maxBulan, nilai: s.max }, { bulan: s.minBulan, nilai: s.min }]

function Trend({ no, title, kicker, dataKey, color, name, s, stat, children, step }) {
  const [mx, mn] = ends(s)
  return (
    <Slide no={no} kicker={kicker} title={title}>
      <div className="split">
        <div className="card chart"><TrendLine data={MONTHLY} dataKey={dataKey} color={color} name={name} maxPoint={mx} minPoint={mn} /></div>
        <div className="side">
          <Mini label={`Tertinggi · ${s.maxBulan}`} value={`US$${M(s.max)} M`} sub="miliar US$" />
          <Mini label={`Terendah · ${s.minBulan}`} value={`US$${M(s.min)} M`} sub="miliar US$" />
          <Insight show={step >= 1} big={stat}>{children}</Insight>
        </div>
      </div>
    </Slide>
  )
}

export default (ctx) => [
  { steps: 0, render: () => (
    <Slide className="cover">
      <div className="cover-main">
        <p className="kicker">Presentasi analisis data</p>
        <h1>Nilai impor Indonesia 2025</h1>
        <h3>Menurut golongan barang ekonomi</h3>
        <div className="meta"><span>Satuan: juta US$</span><span>Januari–Desember 2025</span></div>
        <button className="btn primary big" onClick={ctx.start}>Mulai presentasi</button>
      </div>
      <div className="cover-stat"><span>Total impor setahun</span><Hero value={JUMLAH / 1000} prefix="US$" suffix=" M" className="cover-num" /><small>miliar US$</small></div>
    </Slide>) },

  { steps: 1, render: (st) => (
    <Slide no={2} kicker="Gambaran besar" title="Impor 2025 ditopang bahan baku">
      <div className="split snap">
        <div className="card hero-card">
          <span className="hero-label">Total impor 2025</span>
          <Hero value={JUMLAH / 1000} prefix="US$" decimals={2} />
          <span className="hero-unit">miliar, Januari–Desember</span>
        </div>
        <div className="card comp">
          <span className="hero-label">Komposisi menurut golongan</span>
          <div className="stackbar" role="img" aria-label="Komposisi golongan">
            {[BB, MD, KS].map((x) => <div key={x.golongan} style={{ width: `${x.persen}%`, background: GROUP[x.golongan] }}><b>{fmt(x.persen)}%</b></div>)}
          </div>
          <div className="kpis">
            <KPI label="Bahan baku" value={BB.persen} suffix="%" delay={150} highlight color={C.cyan} />
            <KPI label="Barang modal" value={MD.persen} suffix="%" delay={300} color={C.blue} />
            <KPI label="Barang konsumsi" value={KS.persen} suffix="%" delay={450} color={C.gray} />
          </div>
        </div>
      </div>
      <Insight show={st >= 1} big={`${fmt(BB.persen)}% dari nilai impor`}>adalah bahan baku/penolong, kebutuhan produksi industri lebih besar daripada konsumsi langsung.</Insight>
    </Slide>) },

  { steps: 1, render: (st) => (
    <Slide no={3} kicker="Tren" title="Impor naik sepanjang tahun dan memuncak di Desember">
      <div className="split">
        <div className="card chart">
          <TrendLine data={MONTHLY} dataKey="total" name="Total impor" domain={[16000, 24000]} maxPoint={{ bulan: sT.maxBulan, nilai: sT.max }} minPoint={{ bulan: sT.minBulan, nilai: sT.min }} />
          <p className="note">Sumbu Y tidak dimulai dari nol agar perubahan antarbulan terbaca.</p>
        </div>
        <div className="side">
          <Mini label={`Puncak · ${sT.maxBulan}`} value={`US$${M(sT.max)} M`} sub="miliar US$" />
          <Insight show={st >= 1} big={signed(sT.change)}>Desember dibanding Januari (US${M(sT.max)} M vs US${M(sT.min)} M).</Insight>
        </div>
      </div>
    </Slide>) },

  { steps: 0, render: () => (
    <Slide no={4} kicker="Komposisi" title="Bahan baku mendominasi impor Indonesia">
      <div className="split">
        <div className="card chart">
          <Donut data={GOLONGAN} center={<><b>{fmt(BB.persen)}%</b><span>bahan baku</span></>} />
          <Legend items={GOLONGAN.map((x) => [`${x.golongan} · ${fmt(x.persen)}%`, GROUP[x.golongan]])} />
        </div>
        <div className="side"><Insight big={`US$${M(BB.nilai)} M`}>nilai impor bahan baku, untuk kebutuhan produksi industri, bukan konsumsi langsung.</Insight></div>
      </div>
    </Slide>) },

  { steps: 0, render: () => (
    <Slide no={5} kicker="Perbandingan" title="Bahan baku jauh melampaui dua golongan lain">
      <div className="split">
        <div className="card chart"><HBar data={byValue} labelKey="golongan" yWidth={260} colorBy={(d) => d.golongan} format={M} /></div>
        <div className="side">
          <Mini label="Bahan baku vs barang modal" value={`${fmt(BB.nilai / MD.nilai)}×`} />
          <Mini label="Bahan baku vs barang konsumsi" value={`${fmt(BB.nilai / KS.nilai)}×`} />
          <p className="note">Nilai dalam miliar US$.</p>
        </div>
      </div>
    </Slide>) },

  { steps: 1, render: (st) => <Trend step={st} no={6} kicker="Per golongan" title="Impor barang konsumsi naik, tetapi tetap yang terkecil" dataKey="konsumsi" color={C.gray} name="Barang konsumsi" s={sK} stat={signed(sK.change)}>Januari ke Desember; porsinya hanya {fmt(KS.persen)}% dari total.</Trend> },

  { steps: 1, render: (st) => <Trend step={st} no={7} kicker="Per golongan" title="Bahan baku bertahan di level tertinggi sepanjang tahun" dataKey="bahanBaku" color={C.cyan} name="Bahan baku" s={sB} stat={`US$${M(BB.nilai)} M`}>Setahun penuh, {fmt(BB.persen)}% dari total. Kelompok ini mencakup antara lain bahan bakar & pelumas serta suku cadang.</Trend> },

  { steps: 1, render: (st) => <Trend step={st} no={8} kicker="Temuan" title={`Barang modal tumbuh paling cepat: ${signed(sM.change)}`} dataKey="modal" color={C.blue} name="Barang modal" s={sM} stat={signed(sM.change)}>Januari ke Desember, lebih tinggi daripada bahan baku ({signed(sB.change)}) dan konsumsi ({signed(sK.change)}). Porsi total {fmt(MD.persen)}%.</Trend> },

  { steps: 2, render: (st) => (
    <Slide no={9} kicker="Rincian kategori" title={`Sepuluh kategori menyumbang ${fmt(top10Pct)}% impor`}>
      <div className="split wide">
        <div className="card chart">
          <HBar data={TOP10} labelKey="nama" yWidth={440} colorBy={(d) => d.kelompok} spotlight={st >= 1 ? 0 : null} />
          <Legend items={[['Bahan baku', C.cyan], ['Barang modal', C.blue]]} />
        </div>
        <div className="side">
          <Insight show={st >= 1} big={`US$${M(TOP10[0].nilai)} M`}>Bahan Baku Untuk Industri (Processed): {fmt(top1Pct)}% dari seluruh impor.</Insight>
          <Insight show={st >= 2} label="Konsentrasi" big={`${fmt(top10Pct)}%`}>total impor berasal dari 10 kategori ini.</Insight>
        </div>
      </div>
    </Slide>) },

  { steps: 0, render: () => (
    <Slide no={10} kicker="Per bulan" title="Dominasi bahan baku konsisten di setiap bulan">
      <div className="card chart full">
        <StackedMonths data={MONTHLY} />
        <Legend items={[['Bahan baku', C.cyan], ['Barang modal', C.blue], ['Barang konsumsi', C.gray]]} />
      </div>
    </Slide>) },

  { steps: 3, render: (st) => (
    <Slide no={11} kicker="Ringkasan" title="Tiga temuan utama">
      <div className="finds">
        {[[`${fmt(BB.persen)}%`, 'Didominasi bahan baku', 'dari total impor 2025'], [`US$${M(sT.max)} M`, 'Puncak di Desember', 'nilai impor bulanan tertinggi'], [`US$${M(TOP10[0].nilai)} M`, 'Kategori terbesar', 'Bahan Baku Untuk Industri (Processed)']].map(([n, h, p], i) => (
          <article key={h} className="card find" style={{ opacity: st > i ? 1 : 0.12 }}><b>{n}</b><h3>{h}</h3><p>{p}</p></article>
        ))}
      </div>
    </Slide>) },

  { steps: 0, render: () => (
    <Slide no={12} kicker="Kesimpulan" title="Struktur impor ditopang bahan baku" className="closing">
      <Hero value={JUMLAH / 1000} prefix="US$" suffix=" miliar" className="closing-num" />
      <p className="lead">Impor Indonesia 2025 terutama ditopang kebutuhan bahan baku, dan nilainya mencapai titik tertinggi pada Desember.</p>
      <button className="btn" onClick={ctx.restart}>Ulang dari awal</button>
    </Slide>) },
]
