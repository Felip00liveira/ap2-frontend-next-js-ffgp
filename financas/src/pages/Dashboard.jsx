import { useEffect, useState } from 'react'

import { Wallet } from 'lucide-react'

import { useNavigate } from 'react-router-dom'

import Sidebar from '../components/Sidebar'
import SummaryCard from '../components/SummaryCard'
import FinanceChart from '../components/FinanceChart'

import api from '/services/api'

function Dashboard() {

  const navigate = useNavigate()

  const user = JSON.parse(
    localStorage.getItem('user')
  )

  const [transacoes, setTransacoes] = useState([])

  const [contas, setContas] = useState([])

  useEffect(() => {

    if (!user) {
      navigate('/login')
      return
    }

    carregarDashboard()

  }, [])

  async function carregarDashboard() {

    try {

      const [
        responseTransacoes,
        responseContas
      ] = await Promise.all([

        api.get('/transactions/'),

        api.get(
          `/users/${user.id}/accounts`
        )

      ])

      const transacoesUsuario =
        responseTransacoes.data.filter(
          t => t.user_id === user.id
        )

      setTransacoes(transacoesUsuario)

      setContas(responseContas.data)

    } catch (error) {

      console.error(error)
    }
  }

  // receitas
  const receitas = transacoes
    .filter(t => t.tipo === 'receita')
    .reduce(
      (acc, t) => acc + Number(t.valor),
      0
    )

  // despesas
  const despesas = transacoes
    .filter(t => t.tipo === 'despesa')
    .reduce(
      (acc, t) => acc + Number(t.valor),
      0
    )

  // saldo geral
  const saldoTotal = contas.reduce(
    (acc, conta) =>
      acc + Number(conta.saldo_inicial),
    0
  )

  // últimas transações
  const ultimasTransacoes =
    [...transacoes]
      .sort(
        (a, b) =>
          new Date(b.data) -
          new Date(a.data)
      )
      .slice(0, 5)

  return (

    <div className="min-h-screen flex bg-gradient-to-br from-[#07142b] via-[#0c1f42] to-[#06142b] text-white">

      <Sidebar />

      <main className="flex-1 p-8">

        {/* topo */}
        <div>

          <h1 className="text-4xl font-bold">

            Olá, {user.nome} 👋

          </h1>

          <p className="text-gray-400 mt-2">

            Aqui está seu resumo financeiro

          </p>

        </div>

        {/* cards gerais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

          <SummaryCard
            title="Saldo Total"
            value={`R$ ${saldoTotal.toFixed(2)}`}
            color="text-emerald-400"
          />

          <SummaryCard
            title="Receitas"
            value={`R$ ${receitas.toFixed(2)}`}
            color="text-emerald-400"
          />

          <SummaryCard
            title="Despesas"
            value={`R$ ${despesas.toFixed(2)}`}
            color="text-red-400"
          />

        </div>

        {/* contas */}
        <div className="mt-10">

          <div className="flex items-center gap-3 mb-6">

            <Wallet className="text-emerald-400" />

            <h2 className="text-2xl font-bold">

              Suas Contas

            </h2>

          </div>

          {contas.length === 0 ? (

            <div className="bg-[#0f2342] p-6 rounded-2xl border border-white/5">

              <p className="text-gray-400">

                Nenhuma conta cadastrada

              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

              {contas.map(conta => {

  // transações da conta
  const transacoesConta = transacoes.filter(
    t => t.conta_id === conta.id
  )

  // receitas da conta
  const receitasConta = transacoesConta
    .filter(t => t.tipo === 'receita')
    .reduce(
      (acc, t) => acc + Number(t.valor),
      0
    )

  // despesas da conta
  const despesasConta = transacoesConta
    .filter(t => t.tipo === 'despesa')
    .reduce(
      (acc, t) => acc + Number(t.valor),
      0
    )

  return (

    <div
      key={conta.id}
      className="bg-[#0f2342] rounded-2xl p-6 border border-white/5 shadow-lg hover:scale-[1.02] transition"
    >

      {/* topo */}
      <div className="flex justify-between items-start">

        <div>

          <h3 className="text-xl font-semibold">

            {conta.nome_conta}

          </h3>

          <p className="text-gray-400 mt-1">

            {conta.banco}

          </p>

        </div>

        <span className="text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full capitalize">

          {conta.tipo_conta}

        </span>

      </div>

      {/* saldo */}
      <div className="mt-6">

        <p className="text-gray-400 text-sm">

          Saldo Atual

        </p>

        <h2 className="text-3xl font-bold text-emerald-400 mt-2">

          R$ {Number(
            conta.saldo_inicial
          ).toFixed(2)}

        </h2>

      </div>

      {/* receitas e despesas */}
      <div className="grid grid-cols-2 gap-4 mt-6">

        {/* receitas */}
        <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/10">

          <p className="text-sm text-gray-400">

            Receitas

          </p>

          <h3 className="text-xl font-bold text-emerald-400 mt-2">

            R$ {receitasConta.toFixed(2)}

          </h3>

        </div>

        {/* despesas */}
        <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/10">

          <p className="text-sm text-gray-400">

            Despesas

          </p>

          <h3 className="text-xl font-bold text-red-400 mt-2">

            R$ {despesasConta.toFixed(2)}

          </h3>

        </div>

      </div>

      {/* quantidade */}
      <div className="mt-5 text-sm text-gray-400">

        {transacoesConta.length} transações

      </div>

    </div>

  )

})}

            </div>

          )}

        </div>

        {/* gráfico */}
        <div className="mt-10">

          <FinanceChart
            transacoes={transacoes}
          />

        </div>

        {/* últimas transações */}
        <div className="mt-10 bg-[#0f2342] rounded-2xl p-6 border border-white/5 shadow-lg">

          <h2 className="text-2xl font-bold mb-6">

            Últimas Transações

          </h2>

          {ultimasTransacoes.length === 0 ? (

            <p className="text-gray-400">

              Nenhuma transação encontrada

            </p>

          ) : (

            <div className="space-y-4">

              {ultimasTransacoes.map(t => (

                <div
                  key={t.id}
                  className="flex justify-between items-center border-b border-white/5 pb-4"
                >

                  <div>

                    <p className="font-medium">

                      {t.descricao}

                    </p>

                    <span className="text-sm text-gray-400">

                      {new Date(t.data)
                        .toLocaleDateString('pt-BR')}

                    </span>

                  </div>

                  <span
                    className={
                      t.tipo === 'receita'
                        ? 'text-emerald-400 font-semibold'
                        : 'text-red-400 font-semibold'
                    }
                  >

                    {t.tipo === 'receita'
                      ? '+'
                      : '-'}

                    {' '}R$ {Number(t.valor).toFixed(2)}

                  </span>

                </div>

              ))}

            </div>

          )}

        </div>

      </main>

    </div>
  )
}

export default Dashboard