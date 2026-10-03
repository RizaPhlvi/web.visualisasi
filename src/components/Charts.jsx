import { ResponsiveContainer, LineChart, Line, BarChart, Bar, Cell, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, LabelList, ReferenceDot } from 'recharts'
import { fmt, fmtInt } from '../data'

export const COLORS = { cyan: '#22d3ee', blue: '#3b82f6', purple: '#a78bfa', gold: '#fbbf24', text: '#e5e7eb', mute: '#94a3b8', grid: 'rgba(148,163,184,.18)' }
const axis = { stroke: COLORS.mute, tick: { fill: COLORS.mute, fontSize: 13 } }

function Tip({ active, payload, label, name, unit = 'juta US$' }) {
  if (!active || !payload?.length) return null
  const p = payload[0]
  return (
    <div className="tip">
      <b>{p.payload.nama ?? p.payload.golongan ?? label}</b>
      {p.payload.kelompok && <div className="mute">{p.payload.kelompok}</div>}
      <div className="mute">{name ?? p.name}</div>
      <div className="tip-val">{fmt(p.value)} {unit}</div>
    </div>
  )
}

export function TrendLine({ data, dataKey, color = COLORS.cyan, name, domain, maxPoint, minPoint }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 16, right: 24, left: 8, bottom: 8 }}>
        <CartesianGrid stroke={COLORS.grid} vertical={false} />
        <XAxis dataKey="bulan" {...axis} tickFormatter={(b) => b.slice(0, 3)} />
        <YAxis {...axis} width={70} domain={domain} tickFormatter={fmtInt} label={{ value: 'Juta US$', angle: -90, position: 'insideLeft', fill: COLORS.mute, fontSize: 12 }} />
        <Tooltip content={<Tip name={name} />} />
        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={3.5} dot={{ r: 5, fill: color }} activeDot={{ r: 8 }} animationDuration={1200} />
        {maxPoint && (
          <ReferenceDot x={maxPoint.bulan} y={maxPoint.nilai} r={8} fill={COLORS.gold} stroke="#fff" strokeWidth={2}
            label={{ value: 'Tertinggi', position: 'top', fill: COLORS.gold, fontSize: 14, fontWeight: 'bold', dy: -12 }} />
        )}
        {minPoint && (
          <ReferenceDot x={minPoint.bulan} y={minPoint.nilai} r={6} fill={COLORS.mute} stroke="#fff" strokeWidth={2}
            label={{ value: 'Terendah', position: 'bottom', fill: COLORS.mute, fontSize: 12, fontWeight: 'bold', dy: 16 }} />
        )}
      </LineChart>
    </ResponsiveContainer>
  )
}

export function Donut({ data }) {
  const cols = [COLORS.purple, COLORS.cyan, COLORS.gold]
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} dataKey="nilai" nameKey="golongan" innerRadius="55%" outerRadius="85%" paddingAngle={2} stroke="none" animationDuration={1200}
          label={({ percent }) => `${fmt(percent * 100, 2)}%`} labelLine={false}>
          {data.map((d, i) => <Cell key={d.golongan} fill={cols[i]} />)}
        </Pie>
        <Tooltip content={<Tip />} />
      </PieChart>
    </ResponsiveContainer>
  )
}

export function HBar({ data, labelKey, yWidth = 200, colors = [COLORS.cyan] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 90, left: 8, bottom: 8 }}>
        <CartesianGrid stroke={COLORS.grid} horizontal={false} />
        <XAxis type="number" {...axis} tickFormatter={fmtInt} />
        <YAxis type="category" dataKey={labelKey} width={yWidth} interval={0} {...axis} tick={{ fill: COLORS.text, fontSize: 13 }} />
        <Tooltip content={<Tip name="Nilai impor 2025" />} cursor={{ fill: 'rgba(255,255,255,.05)' }} />
        <Bar dataKey="nilai" radius={[0, 8, 8, 0]} animationDuration={1200}>
          {data.map((d, i) => <Cell key={d[labelKey]} fill={colors[i % colors.length]} />)}
          <LabelList dataKey="nilai" position="right" formatter={(v) => fmt(v)} fill={COLORS.text} fontSize={13} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export function MonthBars({ data, dataKey, highlight }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 16, right: 24, left: 8, bottom: 8 }}>
        <CartesianGrid stroke={COLORS.grid} vertical={false} />
        <XAxis dataKey="bulan" {...axis} tickFormatter={(b) => b.slice(0, 3)} />
        <YAxis {...axis} width={70} tickFormatter={fmtInt} label={{ value: 'Juta US$', angle: -90, position: 'insideLeft', fill: COLORS.mute, fontSize: 12 }} />
        <Tooltip content={<Tip name="Total Impor" />} cursor={{ fill: 'rgba(255,255,255,.05)' }} />
        <Bar dataKey={dataKey} radius={[8, 8, 0, 0]} animationDuration={1200}>
          {data.map((d) => <Cell key={d.bulan} fill={d.bulan === highlight ? COLORS.gold : COLORS.blue} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
