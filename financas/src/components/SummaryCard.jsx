function SummaryCard({ title, value, color }) {
  return (
    <div className="bg-[#0f2342] rounded-2xl p-6 shadow-lg border border-white/5 hover:scale-[1.02] transition">
      <p className="text-gray-400">{title}</p>
      <h3 className={`text-3xl font-bold mt-2 ${color}`}>
        {value}
      </h3>
    </div>
  )
}

export default SummaryCard