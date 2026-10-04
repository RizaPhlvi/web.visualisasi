import { ResponsiveContainer, LineChart, Line, BarChart, Bar, Cell, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, LabelList, ReferenceDot } from 'recharts'
import { fmt, fmtInt } from '../data'
import { C, GROUP, M } from '../theme'

const ax = { stroke: C.mute, tick: { fill: C.mute, fontSize: 22 } }
const kind = { animationDuration: 900, isAnimationActive: true }

function Tip({ active, payload, label, unit = 'juta US$' }) {
  if (!active || !payload?.length) return null
  const p0 = payload[0].payload
  return (
    <div className="tip">
      <b>{p0.nama ?? p0.golongan ?? label}</b>
      {p0.kelompok && <div className="mute">{p0.kelompok}</div>}
      {payload.map((p) => <div key={p.dataKey} className="tip-val">{payload.length > 1 && <span className="mute">{p.name}: </span>}{fmt(p.value)} {unit}</div>)}
    </div>
  )
}

// Garis tren. Domain Y eksplisit + margin lebar agar anotasi tidak terpotong.
export function TrendLine({ data, dataKey, color = C.cyan, name, domain, maxPoint, minPoint }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 56, right: 90, left: 10, bottom: 10 }}>
        <CartesianGrid stroke={C.grid} vertical={false} />
        <XAxis dataKey="bulan" {...ax} tickFormatter={(b) => b.slice(0, 3)} />
        <YAxis {...ax} width={96} domain={domain} tickFormatter={fmtInt} />
        <Tooltip content={<Tip />} />
        <Line type="monotone" dataKey={dataKey} name={name} stroke={color} strokeWidth={5} dot={{ r: 6, fill: color, strokeWidth: 0 }} activeDot={{ r: 10 }} {...kind} animationDuration={1300} />
        {minPoint && <ReferenceDot x={minPoint.bulan} y={minPoint.nilai} r={9} fill={C.bg} stroke={C.mute} strokeWidth={3} ifOverflow="visible"
          label={{ value: `${minPoint.bulan.slice(0, 3)} · ${M(minPoint.nilai)} M`, position: 'right', fill: C.mute, fontSize: 22, dx: 6, dy: 24 }} />}
        {maxPoint && <ReferenceDot x={maxPoint.bulan} y={maxPoint.nilai} r={11} fill={C.gold} stroke="#fff" strokeWidth={3} ifOverflow="visible"
          label={{ value: `${maxPoint.bulan.slice(0, 3)} · ${M(maxPoint.nilai)} M`, position: 'top', fill: C.gold, fontSize: 24, fontWeight: 700, dy: -10 }} />}
      </LineChart>
    </ResponsiveContainer>
  )
}

export function Donut({ data, center }) {
  return (
    <div className="donut">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="nilai" nameKey="golongan" innerRadius="60%" outerRadius="92%" startAngle={90} endAngle={-270} paddingAngle={2} stroke="none" {...kind} animationDuration={1200}>
            {data.map((d) => <Cell key={d.golongan} fill={GROUP[d.golongan]} />)}
          </Pie>
          <Tooltip content={<Tip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="donut-center">{center}</div>
    </div>
  )
}

// Batang horizontal. Warna mengikuti kelompok (cyan = bahan baku, biru = modal, abu = konsumsi).
export function HBar({ data, labelKey, yWidth = 240, colorBy, format = (v) => fmt(v), spotlight }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 130, left: 10, bottom: 8 }} barCategoryGap="22%">
        <CartesianGrid stroke={C.grid} horizontal={false} />
        <XAxis type="number" {...ax} tickFormatter={(v) => (format === M ? fmtInt(v / 1000) : fmtInt(v))} />
        <YAxis type="category" dataKey={labelKey} width={yWidth} interval={0} {...ax} tick={{ fill: C.text, fontSize: 22 }} />
        <Tooltip content={<Tip />} cursor={{ fill: 'rgba(255,255,255,.05)' }} />
        <Bar dataKey="nilai" radius={[0, 8, 8, 0]} {...kind}>
          {data.map((d, i) => <Cell key={d[labelKey]} fill={GROUP[colorBy(d)]} fillOpacity={spotlight == null || spotlight === i ? 1 : 0.35} />)}
          <LabelList dataKey="nilai" position="right" formatter={format} fill={C.text} fontSize={22} fontWeight={700} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

// Komposisi per bulan (bertumpuk) -> apakah dominasi bahan baku stabil?
export function StackedMonths({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
        <CartesianGrid stroke={C.grid} vertical={false} />
        <XAxis dataKey="bulan" {...ax} tickFormatter={(b) => b.slice(0, 3)} />
        <YAxis {...ax} width={96} tickFormatter={fmtInt} />
        <Tooltip content={<Tip />} cursor={{ fill: 'rgba(255,255,255,.05)' }} />
        <Bar dataKey="bahanBaku" name="Bahan Baku" stackId="a" fill={C.cyan} {...kind} />
        <Bar dataKey="modal" name="Barang Modal" stackId="a" fill={C.blue} {...kind} />
        <Bar dataKey="konsumsi" name="Barang Konsumsi" stackId="a" fill={C.gray} radius={[6, 6, 0, 0]} {...kind} />
      </BarChart>
    </ResponsiveContainer>
  )
}
