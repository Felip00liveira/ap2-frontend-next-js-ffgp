import { useEffect, useState } from 'react'
import { Pencil, Trash2, Landmark } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import Sidebar from '../components/Sidebar'
import api from '/services/api'

function Contas() {

  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem('user'))

  const [form, setForm] = useState({
    nome_conta: '',
    banco: '',
    tipo_conta: 'corrente',
    saldo_inicial: ''
  })

  const [contas, setContas] = useState([])

  const [editandoId, setEditandoId] = useState(null)

  useEffect(() => {

    if (!user) {
      navigate('/login')
      return
    }

    carregarContas()

  }, [])

  async function carregarContas() {

    try {

      const response = await api.get(
        `/users/${user.id}/accounts`
      )

      setContas(response.data)

    } catch (error) {
      console.error(error)
    }
  }

  function handleChange(e) {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  async function handleSubmit(e) {

    e.preventDefault()

    try {

      const dadosConta = {
        ...form,
        saldo_inicial: Number(form.saldo_inicial),
        user_id: user.id
      }

      if (editandoId) {

        await api.put(
          `/accounts/${editandoId}`,
          dadosConta
        )

        setEditandoId(null)

      } else {

        await api.post(
          '/accounts/',
          dadosConta
        )
      }

      await carregarContas()

      setForm({
        nome_conta: '',
        banco: '',
        tipo_conta: 'corrente',
        saldo_inicial: ''
      })

    } catch (error) {

      console.error(error)

      if (error.response) {
        console.log(error.response.data)
      }
    }
  }

  function handleEditar(conta) {

    setForm({
      nome_conta: conta.nome_conta,
      banco: conta.banco,
      tipo_conta: conta.tipo_conta,
      saldo_inicial: conta.saldo_inicial
    })

    setEditandoId(conta.id)
  }

  async function handleExcluir(id) {

    try {

      await api.delete(`/accounts/${id}`)

      await carregarContas()

    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#07142b] via-[#0c1f42] to-[#06142b] text-white">

      <Sidebar />

      <main className="flex-1 p-8">

        {/* topo */}
        <div className="flex items-center gap-3 mb-8">

          <Landmark
            className="text-emerald-400"
            size={32}
          />

          <div>
            <h1 className="text-3xl font-bold">
              Contas Bancárias
            </h1>

            <p className="text-gray-400">
              Gerencie suas contas cadastradas
            </p>
          </div>
        </div>

        {/* formulário */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#0f2342] rounded-2xl p-6 border border-white/5 shadow-lg space-y-4 max-w-2xl"
        >

          <input
            name="nome_conta"
            placeholder="Nome da conta"
            value={form.nome_conta}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-[#13233f] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />

          <input
            name="banco"
            placeholder="Banco"
            value={form.banco}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-[#13233f] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />

          <select
            name="tipo_conta"
            value={form.tipo_conta}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-[#13233f] text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            <option value="corrente">
              Conta Corrente
            </option>

            <option value="poupança">
              Poupança
            </option>

            <option value="investimento">
              Investimento
            </option>

            <option value="outros">
              Outros
            </option>
          </select>

          <input
            name="saldo_inicial"
            type="number"
            placeholder="Saldo inicial"
            value={form.saldo_inicial}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-[#13233f] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 transition font-semibold"
          >
            {editandoId
              ? 'Atualizar Conta'
              : 'Adicionar Conta'}
          </button>
        </form>

        {/* tabela */}
        <div className="mt-10 bg-[#0f2342] rounded-2xl border border-white/5 shadow-lg overflow-hidden">

          <table className="w-full">

            <thead className="bg-[#13233f] text-gray-300">

              <tr>
                <th className="p-4 text-left">
                  Conta
                </th>

                <th className="p-4 text-left">
                  Banco
                </th>

                <th className="p-4 text-left">
                  Tipo
                </th>

                <th className="p-4 text-left">
                  Saldo
                </th>

                <th className="p-4 text-left">
                  Ações
                </th>
              </tr>
            </thead>

            <tbody>

              {contas.map((conta) => (

                <tr
                  key={conta.id}
                  className="border-t border-white/5 hover:bg-white/5 transition"
                >

                  <td className="p-4 font-medium">
                    {conta.nome_conta}
                  </td>

                  <td className="p-4">
                    {conta.banco}
                  </td>

                  <td className="p-4 capitalize">
                    {conta.tipo_conta}
                  </td>

                  <td className="p-4 text-emerald-400 font-semibold">
                    R$ {Number(conta.saldo_inicial).toFixed(2)}
                  </td>

                  <td className="p-4">

                    <div className="flex gap-3">

                      <button
                        onClick={() => handleEditar(conta)}
                        className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 transition"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => handleExcluir(conta.id)}
                        className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition"
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>

      </main>
    </div>
  )
}

export default Contas