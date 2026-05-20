import { useEffect, useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import Sidebar from '../components/Sidebar'
import api from '/services/api'

function Transacao() {

  const navigate = useNavigate()

  const user = JSON.parse(
    localStorage.getItem('user')
  )

  const [form, setForm] = useState({
    descricao: '',
    valor: '',
    tipo: 'receita',
    data: '',
    conta_id: '',
    categoria_id: ''
  })

  const [transacoes, setTransacoes] = useState([])

  const [contas, setContas] = useState([])

  const [categorias, setCategorias] = useState([])

  const [editandoId, setEditandoId] = useState(null)

  // filtros
  const [filtroTipo, setFiltroTipo] = useState('')
  const [filtroConta, setFiltroConta] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('')
  const [busca, setBusca] = useState('')
  const [ordenacao, setOrdenacao] = useState('recentes')

  useEffect(() => {

    if (!user) {
      navigate('/login')
      return
    }

    carregarDados()

  }, [])

  async function carregarDados() {

    try {

      const [
        responseTransacoes,
        responseContas,
        responseCategorias
      ] = await Promise.all([

        api.get('/transactions/'),

        api.get(
          `/users/${user.id}/accounts`
        ),

        api.get(
          `/users/${user.id}/categories`
        )
      ])

      const transacoesUsuario =
        responseTransacoes.data.filter(
          t => t.user_id === user.id
        )

      setTransacoes(transacoesUsuario)

      setContas(responseContas.data)

      setCategorias(responseCategorias.data)

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

      const dadosTransacao = {
        ...form,
        valor: Number(form.valor),
        conta_id: Number(form.conta_id),
        categoria_id: Number(form.categoria_id),
        user_id: user.id
      }

      if (editandoId) {

        await api.put(
          `/transactions/${editandoId}`,
          dadosTransacao
        )

        setEditandoId(null)

      } else {

        await api.post(
          '/transactions/',
          dadosTransacao
        )
      }

      await carregarDados()

      setForm({
        descricao: '',
        valor: '',
        tipo: 'receita',
        data: '',
        conta_id: '',
        categoria_id: ''
      })

    } catch (error) {

      console.error(error)

      if (error.response) {
        console.log(error.response.data)
      }
    }
  }

  function handleEditar(transacao) {

    setForm({
      descricao: transacao.descricao,
      valor: transacao.valor,
      tipo: transacao.tipo,
      data: transacao.data,
      conta_id: transacao.conta_id,
      categoria_id: transacao.categoria_id
    })

    setEditandoId(transacao.id)
  }

  async function handleExcluir(id) {

    try {

      await api.delete(
        `/transactions/${id}`
      )

      await carregarDados()

    } catch (error) {
      console.error(error)
    }
  }

  // filtros + ordenação
  const transacoesFiltradas = [...transacoes]

    .filter(t => {

      const descricaoMatch =
        t.descricao
          .toLowerCase()
          .includes(busca.toLowerCase())

      const tipoMatch =
        filtroTipo === ''
        || t.tipo === filtroTipo

      const contaMatch =
        filtroConta === ''
        || t.conta_id === Number(filtroConta)

      const categoriaMatch =
        filtroCategoria === ''
        || t.categoria_id === Number(filtroCategoria)

      return (
        descricaoMatch
        && tipoMatch
        && contaMatch
        && categoriaMatch
      )
    })

    .sort((a, b) => {

      if (ordenacao === 'recentes') {
        return new Date(b.data) - new Date(a.data)
      }

      if (ordenacao === 'antigas') {
        return new Date(a.data) - new Date(b.data)
      }

      if (ordenacao === 'maior') {
        return Number(b.valor) - Number(a.valor)
      }

      if (ordenacao === 'menor') {
        return Number(a.valor) - Number(b.valor)
      }

      return 0
    })

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#07142b] via-[#0c1f42] to-[#06142b] text-white">

      <Sidebar />

      <main className="flex-1 p-8">

        {/* topo */}
        <div className="flex justify-between items-center mb-8">

          <h2 className="text-3xl font-bold">
            Transações
          </h2>

        </div>

        {/* formulário */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#0f2342] rounded-2xl p-6 shadow-lg border border-white/5 space-y-4 mb-8"
        >

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <input
              name="descricao"
              placeholder="Descrição"
              value={form.descricao}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-[#13233f] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />

            <input
              name="valor"
              type="number"
              placeholder="Valor"
              value={form.valor}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-[#13233f] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />

            <select
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-[#13233f] text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >

              <option value="receita">
                Receita
              </option>

              <option value="despesa">
                Despesa
              </option>

            </select>

            <input
              name="data"
              type="date"
              value={form.data}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-[#13233f] text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />

            <select
              name="conta_id"
              value={form.conta_id}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-[#13233f] text-white"
            >

              <option value="">
                Selecione a conta
              </option>

              {contas.map((conta) => (

                <option
                  key={conta.id}
                  value={conta.id}
                >
                  {conta.nome_conta}
                </option>

              ))}

            </select>

            <select
              name="categoria_id"
              value={form.categoria_id}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-[#13233f] text-white"
            >

              <option value="">
                Selecione a categoria
              </option>

              {categorias.map((categoria) => (

                <option
                  key={categoria.id}
                  value={categoria.id}
                >
                  {categoria.nome}
                </option>

              ))}

            </select>

          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 font-semibold transition"
          >

            {editandoId
              ? 'Atualizar Transação'
              : 'Salvar Transação'}

          </button>

        </form>

        {/* filtros */}
        <div className="bg-[#0f2342] rounded-2xl p-6 border border-white/5 shadow-lg mb-6">

          <h3 className="text-xl font-semibold mb-5">
            Filtros
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

            <input
              type="text"
              placeholder="Buscar descrição..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="px-4 py-3 rounded-xl bg-[#13233f] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />

            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="px-4 py-3 rounded-xl bg-[#13233f] text-white"
            >

              <option value="">
                Todos os tipos
              </option>

              <option value="receita">
                Receita
              </option>

              <option value="despesa">
                Despesa
              </option>

            </select>

            <select
              value={filtroConta}
              onChange={(e) => setFiltroConta(e.target.value)}
              className="px-4 py-3 rounded-xl bg-[#13233f] text-white"
            >

              <option value="">
                Todas as contas
              </option>

              {contas.map(conta => (

                <option
                  key={conta.id}
                  value={conta.id}
                >
                  {conta.nome_conta}
                </option>

              ))}

            </select>

            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="px-4 py-3 rounded-xl bg-[#13233f] text-white"
            >

              <option value="">
                Todas categorias
              </option>

              {categorias.map(categoria => (

                <option
                  key={categoria.id}
                  value={categoria.id}
                >
                  {categoria.nome}
                </option>

              ))}

            </select>

            <select
              value={ordenacao}
              onChange={(e) => setOrdenacao(e.target.value)}
              className="px-4 py-3 rounded-xl bg-[#13233f] text-white"
            >

              <option value="recentes">
                Mais recentes
              </option>

              <option value="antigas">
                Mais antigas
              </option>

              <option value="maior">
                Maior valor
              </option>

              <option value="menor">
                Menor valor
              </option>

            </select>

          </div>

        </div>

        {/* tabela */}
        <div className="bg-[#0f2342] rounded-2xl shadow-lg border border-white/5 overflow-hidden">

          <table className="w-full">

            <thead className="bg-[#13233f] text-left text-gray-300">

              <tr>

                <th className="p-4">
                  Descrição
                </th>

                <th className="p-4">
                  Valor
                </th>

                <th className="p-4">
                  Tipo
                </th>

                <th className="p-4">
                  Conta
                </th>

                <th className="p-4">
                  Categoria
                </th>

                <th className="p-4">
                  Data
                </th>

                <th className="p-4">
                  Ações
                </th>

              </tr>

            </thead>

            <tbody>

              {transacoesFiltradas.map((t) => (

                <tr
                  key={t.id}
                  className="border-t border-white/5 hover:bg-white/5 transition"
                >

                  <td className="p-4">
                    {t.descricao}
                  </td>

                  <td
                    className={`p-4 font-semibold ${
                      t.tipo === 'receita'
                        ? 'text-emerald-400'
                        : 'text-red-400'
                    }`}
                  >

                    {t.tipo === 'receita'
                      ? '+'
                      : '-'}{' '}

                    R$ {Number(t.valor).toFixed(2)}

                  </td>

                  <td className="p-4 capitalize">
                    {t.tipo}
                  </td>

                  <td className="p-4">

                    {
                      contas.find(
                        conta => conta.id === t.conta_id
                      )?.nome_conta || 'Conta'
                    }

                  </td>

                  <td className="p-4">

                    {
                      categorias.find(
                        categoria => categoria.id === t.categoria_id
                      )?.nome || 'Categoria'
                    }

                  </td>

                  <td className="p-4">
                    {t.data}
                  </td>

                  <td className="p-4">

                    <div className="flex gap-3">

                      <button
                        onClick={() => handleEditar(t)}
                        className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => handleExcluir(t.id)}
                        className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30"
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

export default Transacao