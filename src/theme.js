// Satu warna = satu makna. Emas hanya untuk sorotan (puncak / insight).
export const C = { bg: "#0a1020", cyan: "#22d3ee", blue: "#3b82f6", gray: "#94a3b8", gold: "#fbbf24", text: "#f1f5f9", mute: "#a9b6ca", grid: "rgba(148,163,184,.18)" }
export const GROUP = { "Bahan Baku": C.cyan, "Barang Modal": C.blue, "Barang Konsumsi": C.gray }
export const M = (v, d = 2) => new Intl.NumberFormat("id-ID", { minimumFractionDigits: d, maximumFractionDigits: d }).format(v / 1000) // juta -> miliar
