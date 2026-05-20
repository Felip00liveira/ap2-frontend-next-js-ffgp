function ChartPlaceholder() {
  return (
    <div className="bg-[#0f2342] rounded-2xl p-6 shadow-lg border border-white/5 mt-8">
      <h3 className="text-lg font-semibold mb-4">Visão Geral</h3>

      <div className="h-48 flex items-end gap-3">
        {[40, 60, 30, 80, 50, 90, 70].map((height, index) => (
          <div
            key={index}
            className="flex-1 bg-emerald-400/70 rounded-t-xl hover:bg-emerald-400 transition"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </div>
  )
}

export default ChartPlaceholder