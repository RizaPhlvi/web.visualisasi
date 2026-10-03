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

function GroupSlide({ no, title, dataKey, color, name, extra }) {
  const s = stats(dataKey);
  return (
    <Slide no={no} title={title}>
      <div className="split">
        <div className="card chart">
          <TrendLine 
            data={MONTHLY} 
            dataKey={dataKey} 
            color={color} 
            name={name}
            maxPoint={{ bulan: s.maxBulan, nilai: s.max }}
            minPoint={{ bulan: s.minBulan, nilai: s.min }}
          />
        </div>
        <div className="side">
          <div className="card mini"><span>Tertinggi · {s.maxBulan}</span><b>{fmt(s.max)}</b><small>juta US$</small></div>
          <div className="card mini"><span>Terendah · {s.minBulan}</span><b>{fmt(s.min)}</b><small>juta US$</small></div>
          <Insight>{extra ?? `Dari Januari ke Desember nilainya berubah ${signed(s.change)}.`}</Insight>
        </div>
      </div>
    </Slide>
  );
}

function buildSlides(next, restart) {
  return [
    // 01 — COVER
    () => (
      <Slide className="cover">
        <p className="eyebrow">PRESENTASI ANALISIS DATA</p>
        <h1>Analisis Nilai Impor Indonesia 2025</h1>
        <h3>Menurut Golongan Barang Ekonomi</h3>
        <div className="meta"><span>Satuan: Juta US$</span><span>Periode: Januari–Desember 2025</span></div>
        <button className="btn primary big" onClick={next}>Mulai Presentasi →</button>
      </Slide>
    ),

    // 02 — SNAPSHOT DATA (KPI UTAMA)
    () => (
      <Slide no={2} title="US$241,36 Miliar">
        <div className="kpis">
          <KPI label="Total Impor 2025" value={241.36} unit="Miliar US$" delay={0} />
          <KPI label="Bahan Baku" value={70.1} unit="%" delay={100} highlight />
          <KPI label="Barang Modal" value={20.6} unit="%" delay={200} />
          <KPI label="Barang Konsumsi" value={9.3} unit="%" delay={300} />
        </div>
        <div className="card insight center">
          <p>Struktur impor 2025 didominasi oleh <b>Bahan Baku (70,1%)</b>, menunjukkan ketergantungan industri domestik yang tinggi terhadap pasokan luar negeri.</p>
        </div>
      </Slide>
    ),

   // 03 — TREN IMPOR
() => (
  <Slide no={3} title="Desember mencatat nilai impor tertinggi">
    <div className="split">
      <div className="card chart">
        <TrendLine 
          data={MONTHLY} 
          dataKey="total" 
          name="Total Impor" 
          maxPoint={{ bulan: sTotal.maxBulan, nilai: sTotal.max }}
          minPoint={{ bulan: sTotal.minBulan, nilai: sTotal.min }}
        />
      </div>
      <div className="side">
        <div className="card mini">
          <span>Puncak Impor · Desember</span>
          <b>US$23,77 Miliar</b>
        </div>
        <div className="card insight">
          <p>Nilai impor berfluktuasi sepanjang tahun, mencapai puncaknya di <b>Desember (US$23,77 M)</b> dan terendah di <b>Januari (US$17,86 M)</b>.</p>
        </div>
      </div>
    </div>
  </Slide>
),
    // 04 — STRUKTUR IMPOR (KOMPOSISI)
    () => (
      <Slide no={4} title="Bahan baku mendominasi impor Indonesia">
        <div className="split">
          <div className="card chart"><Donut data={GOLONGAN} /></div>
          <div className="side">
            <div className="card mini huge">
              <span>Bahan Baku</span>
              <b>70,1%</b>
              <small>US$169,22 Miliar</small>
            </div>
            <div className="card insight">
              <p>Dominasi ini menegaskan bahwa impor Indonesia utamanya ditujukan untuk <b>kebutuhan produksi industri</b>, bukan konsumsi langsung.</p>
            </div>
          </div>
        </div>
      </Slide>
    ),

    // 05 — PERBANDINGAN GOLONGAN
    () => (
      <Slide no={5} title="Bahan baku jauh melampaui golongan lainnya">
        <div className="card chart full"><HBar data={byValue.map((g) => ({ ...g, nama: g.golongan }))} labelKey="golongan" yWidth={170} colors={[COLORS.cyan, COLORS.blue, COLORS.mute]} /></div>
      </Slide>
    ),

    // 06 — BARANG KONSUMSI
    () => <GroupSlide no={6} title="Barang konsumsi hanya 9,3% dari total" dataKey="konsumsi" color={COLORS.mute} name="Barang Konsumsi" />,

    // 07 — BAHAN BAKU (FOKUS UTAMA)
    () => <GroupSlide no={7} title="Bahan baku: US$169,22 Miliar" dataKey="bahanBaku" color={COLORS.cyan} name="Bahan Baku" extra="Kontribusi 70,1% menjadikan bahan baku sebagai penggerak utama struktur impor 2025." />,

    // 08 — BARANG MODAL
    () => <GroupSlide no={8} title="Barang modal menyumbang 20,6%" dataKey="modal" color={COLORS.blue} name="Barang Modal" />,

    // 09 — TOP 10 KATEGORI
    () => (
      <Slide no={9} title="Bahan baku industri adalah kategori terbesar">
        <div className="card chart full"><HBar data={TOP10} labelKey="nama" yWidth={330} colors={[COLORS.cyan, ...Array(9).fill(COLORS.blue)]} /></div>
        <div className="card insight center">
          <p><b>Bahan Baku Untuk Industri</b> menyumbang US$77,58 Miliar, jauh di atas kategori lainnya.</p>
        </div>
      </Slide>
    ),

    // 10 — PERBANDINGAN BULANAN
    () => (
      <Slide no={10} title="Fluktuasi nilai impor antarbulan">
        <div className="card chart full"><MonthBars data={MONTHLY} dataKey="total" highlight={sTotal.maxBulan} /></div>
      </Slide>
    ),

    // 11 — 3 INSIGHT UTAMA (BERSIH & RINGKAS)
    () => (
      <Slide no={11} title="3 Temuan Utama">
        <div className="insight-grid">
          <div className="insight-card">
            <span className="num">01</span>
            <h3>Didominasi Bahan Baku</h3>
            <p>70,1% dari total impor 2025 adalah bahan baku.</p>
          </div>
          <div className="insight-card">
            <span className="num">02</span>
            <h3>Puncak di Desember</h3>
            <p>Nilai impor mencapai US$23,77 miliar di akhir tahun.</p>
          </div>
          <div className="insight-card">
            <span className="num">03</span>
            <h3>Kategori Terbesar</h3>
            <p>Bahan baku industri menyumbang US$77,58 miliar.</p>
          </div>
        </div>
      </Slide>
    ),

    // 12 — KESIMPULAN
    () => (
      <Slide no={12} title="Struktur impor ditopang bahan baku" className="closing">
        <div className="big">US$241,36<small> Miliar</small></div>
        <p className="lead">Struktur impor Indonesia 2025 terutama ditopang oleh kebutuhan bahan baku, dengan aktivitas impor mencapai titik tertinggi pada Desember.</p>
        <button className="btn primary" onClick={restart}>Terima Kasih</button>
      </Slide>
    ),
  ]
}
