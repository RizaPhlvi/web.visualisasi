// Data bersumber dari Analisis_Impor_2025.xlsx (sheet Data). Satuan: Juta US$. Tidak ada angka tambahan.
export const SUMBER = 'Sumber: BPS, Nilai Impor Menurut Golongan Barang Ekonomi, 2025 (juta US$). Mobil Penumpang tercantum pada dua kelompok dalam tabel sumber.'

export const ANGGOTA = [
  { nim: '60125001', nama: 'Muhammad Sheva Nabeel' },
  { nim: '60125026', nama: 'Dina Nur Vidiana' },
  { nim: '60125032', nama: 'Ahmad Rizza Pahlevi' },
  { nim: '60125038', nama: 'Farkhan Yazid Aghniya' },
  { nim: '60125055', nama: 'Aliyu Ibrahim Ahmad' },
]

export const BULAN = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
export const TOTAL = [17861.3, 18778.9, 18891.8, 20528.4, 20274.5, 19295.9, 20544.3, 19364.3, 20467, 21812.4, 19772.7, 23771.1]
export const KONSUMSI = [1644.5, 1466.8, 1741.7, 1702.9, 1827, 1799.7, 2025.1, 1880.2, 1930.6, 2001.5, 1990.6, 2412.5]
export const BAHAN_BAKU = [12971.9, 13932.1, 13477.4, 14963.5, 14044.1, 13350.8, 14174.4, 13613.7, 13794.3, 15195.8, 13595.8, 16104.8]
export const MODAL = [3245, 3380, 3672.7, 3862, 4403.4, 4145.3, 4344.8, 3870.5, 4742, 4615.2, 4186.3, 5253.8]
export const JUMLAH = 241362.6
export const GOLONGAN = [{"golongan": "Barang Konsumsi", "nilai": 22423}, {"golongan": "Bahan Baku", "nilai": 169218.7}, {"golongan": "Barang Modal", "nilai": 49720.9}].map(g => ({ ...g, persen: (g.nilai / JUMLAH) * 100 }))
export const TOP10 = [{"nama": "Bahan Baku Untuk Industri (Processed)", "kelompok": "Bahan Baku", "nilai": 77577.8}, {"nama": "Barang Modal Kecuali Alat Angkutan", "kelompok": "Barang Modal", "nilai": 42563.5}, {"nama": "Suku Cadang & Perlengkapan Barang Modal", "kelompok": "Bahan Baku", "nilai": 24462.8}, {"nama": "Bahan Bakar & Pelumas (Primary)", "kelompok": "Bahan Baku", "nilai": 12595.4}, {"nama": "Bahan Bakar & Pelumas (Processed)", "kelompok": "Bahan Baku", "nilai": 12135.2}, {"nama": "Bahan Bakar Motor", "kelompok": "Bahan Baku", "nilai": 10758.9}, {"nama": "Suku Cadang & Perlengkapan Alat Angkutan", "kelompok": "Bahan Baku", "nilai": 10151.7}, {"nama": "Bahan Baku Untuk Industri (Primary)", "kelompok": "Bahan Baku", "nilai": 9750.4}, {"nama": "Makanan & Minuman (Primary), Untuk Industri", "kelompok": "Bahan Baku", "nilai": 7575.3}, {"nama": "Alat Angkutan Untuk Industri", "kelompok": "Barang Modal", "nilai": 5360.5}]

export const MONTHLY = BULAN.map((bulan, i) => ({ bulan, total: TOTAL[i], konsumsi: KONSUMSI[i], bahanBaku: BAHAN_BAKU[i], modal: MODAL[i] }))

export const fmt = (v, d = 1) => new Intl.NumberFormat('id-ID', { minimumFractionDigits: d, maximumFractionDigits: d }).format(v)
export const fmtInt = (v) => new Intl.NumberFormat('id-ID').format(v)
export const stats = (key) => {
  const arr = MONTHLY.map((m) => m[key])
  const max = Math.max(...arr), min = Math.min(...arr)
  return { max, min, maxBulan: BULAN[arr.indexOf(max)], minBulan: BULAN[arr.indexOf(min)], change: (arr[11] / arr[0] - 1) * 100 }
}
