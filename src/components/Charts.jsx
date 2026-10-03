import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, ReferenceDot, PieChart, Pie, Cell,
  BarChart, Bar, LabelList
} from 'recharts';

// =========================================
// 🎨 PALET WARNA (SEDERHANA)
// =========================================
export const COLORS = {
  cyan: '#22d3ee',
  blue: '#3b82f6',
  purple: '#a78bfa',
  gold: '#fbbf24',
  mute: '#64748b',
};

const PIE_COLORS = [COLORS.cyan, COLORS.blue, COLORS.gold];

// =========================================
// 📈 LINE CHART DENGAN ANOTASI
// =========================================
export function TrendLine({ data, dataKey, name, color = COLORS.cyan, maxPoint, minPoint }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 30, right: 40, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
        <XAxis 
          dataKey="bulan" 
          stroke="#94a3b8" 
          fontSize={14}
          tickLine={false}
        />
        <YAxis 
          stroke="#94a3b8" 
          fontSize={14}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#0b1220', 
            border: '1px solid #334155', 
            borderRadius: '8px',
            fontSize: '14px'
          }}
          labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
        />
        <Line 
          type="monotone" 
          dataKey={dataKey} 
          name={name} 
          stroke={color} 
          strokeWidth={3} 
          dot={{ r: 3, strokeWidth: 2, fill: '#0b1220', stroke: color }} 
          activeDot={{ r: 6 }} 
        />
        
        {/* ✅ ANOTASI: Titik Tertinggi */}
        {maxPoint && (
          <ReferenceDot 
            x={maxPoint.bulan} 
            y={maxPoint.nilai} 
            r={8} 
            fill={COLORS.gold} 
            stroke="#fff" 
            strokeWidth={2}
            label={{ 
              value: `Tertinggi`, 
              position: 'top', 
              fill: COLORS.gold, 
              fontSize: 14, 
              fontWeight: 'bold',
              dy: -12 
            }} 
          />
        )}

        {/* ✅ ANOTASI: Titik Terendah */}
        {minPoint && (
          <ReferenceDot 
            x={minPoint.bulan} 
            y={minPoint.nilai} 
            r={6} 
            fill={COLORS.mute} 
            stroke="#fff" 
            strokeWidth={2}
            label={{ 
              value: `Terendah`, 
              position: 'bottom', 
              fill: '#94a3b8', 
              fontSize: 12, 
              fontWeight: 'bold',
              dy: 16 
            }} 
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}

// =========================================
// 🍩 DONUT CHART
// =========================================
export function Donut({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius="55%"
          outerRadius="80%"
          paddingAngle={3}
          dataKey="nilai"
          nameKey="golongan"
          label={({ golongan, persen }) => `${golongan}: ${persen.toFixed(1)}%`}
          labelLine={true}
          fontSize={14}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#0b1220', 
            border: '1px solid #334155', 
            borderRadius: '8px' 
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

// =========================================
// 📊 HORIZONTAL BAR CHART
// =========================================
export function HBar({ data, labelKey = "nama", yWidth = 200, colors = [COLORS.cyan] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart 
        data={data} 
        layout="vertical" 
        margin={{ top: 10, right: 40, left: 20, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" horizontal={false} />
        <XAxis type="number" stroke="#94a3b8" fontSize={13} />
        <YAxis 
          type="category" 
          dataKey={labelKey} 
          width={yWidth} 
          stroke="#94a3b8" 
          fontSize={13}
          tickLine={false}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#0b1220', 
            border: '1px solid #334155', 
            borderRadius: '8px' 
          }}
        />
        <Bar dataKey="nilai" radius={[0, 6, 6, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// =========================================
// 📅 BAR CHART BULANAN
// =========================================
export function MonthBars({ data, dataKey = "total", highlight }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
        <XAxis dataKey="bulan" stroke="#94a3b8" fontSize={13} />
        <YAxis stroke="#94a3b8" fontSize={13} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#0b1220', 
            border: '1px solid #334155', 
            borderRadius: '8px' 
          }}
        />
        <Bar dataKey={dataKey} radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.bulan === highlight ? COLORS.gold : COLORS.cyan} 
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
