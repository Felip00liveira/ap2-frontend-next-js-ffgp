import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'

function FinanceChart({ transacoes }) {

  // meses
  const meses = [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez'
  ]

  // estrutura inicial
  const dadosMensais = meses.map((mes) => ({
    mes,
    receitas: 0,
    despesas: 0
  }))

  // agrupar transações por mês
  transacoes.forEach((transacao) => {

    const data = new Date(transacao.data)

    const mes = data.getMonth()

    if (transacao.tipo === 'receita') {

      dadosMensais[mes].receitas += Number(
        transacao.valor
      )

    } else {

      dadosMensais[mes].despesas += Number(
        transacao.valor
      )
    }
  })

  return (

    <div className="bg-[#0f2342] rounded-2xl p-6 border border-white/5 shadow-lg">

      <div className="mb-6">

        <h2 className="text-2xl font-bold">

          Visão Geral Financeira

        </h2>

        <p className="text-gray-400 mt-1">

          Receitas e despesas por mês

        </p>

      </div>

      <div className="h-[400px]">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart data={dadosMensais}>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1f355c"
            />

            <XAxis
              dataKey="mes"
              stroke="#9CA3AF"
            />

            <YAxis
              stroke="#9CA3AF"
            />

            <Tooltip
              contentStyle={{
                backgroundColor: '#13233f',
                border: 'none',
                borderRadius: '12px',
                color: '#fff'
              }}
            />

            <Legend />

            {/* RECEITAS */}
            <Line
              type="monotone"
              dataKey="receitas"
              stroke="#10B981"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
              name="Receitas"
            />

            {/* DESPESAS */}
            <Line
              type="monotone"
              dataKey="despesas"
              stroke="#EF4444"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
              name="Despesas"
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  )
}

export default FinanceChart