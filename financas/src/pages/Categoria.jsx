import { useEffect, useState } from 'react'
import {
  Pencil,
  Trash2,
  Tags
} from 'lucide-react'

import { useNavigate } from 'react-router-dom'

import Sidebar from '../components/Sidebar'
import api from '/services/api'

function Categorias() {

  const navigate = useNavigate()

  const user = JSON.parse(
    localStorage.getItem('user')
  )

  const [form, setForm] = useState({
    nome: '',
    tipo: 'despesa'
  })

  const [categorias, setCategorias] = useState([])

  const [editandoId, setEditandoId] = useState(null)

  useEffect(() => {

    if (!user) {
      navigate('/login')
      return
    }

    carregarCategorias()

  }, [])

  async function carregarCategorias() {

    try {

      const response = await api.get('/categories/')

      const categoriasUsuario = response.data.filter(
        categoria => categoria.user_id === user.id
      )

      setCategorias(categoriasUsuario)

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

      const dadosCategoria = {
        ...form,
        user_id: user.id
      }

      if (editandoId) {

        await api.patch(
          `/categories/${editandoId}`,
          dadosCategoria
        )

        setEditandoId(null)

      } else {

        await api.post(
          '/categories/',
          dadosCategoria
        )
      }

      await carregarCategorias()

      setForm({
        nome: '',
        tipo: 'despesa'
      })

    } catch (error) {

      console.error(error)

      if (error.response) {
        console.log(error.response.data)
      }
    }
  }

  function handleEditar(categoria) {

    setForm({
      nome: categoria.nome,
      tipo: categoria.tipo
    })

    setEditandoId(categoria.id)
  }

  async function handleExcluir(id) {

    try {

      await api.delete(`/categories/${id}`)

      await carregarCategorias()

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

          <Tags
            className="text-emerald-400"
            size={32}
          />

          <div>

            <h1 className="text-3xl font-bold">
              Categorias
            </h1>

            <p className="text-gray-400">
              Gerencie categorias das transações
            </p>

          </div>
        </div>

        {/* formulário */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#0f2342] rounded-2xl p-6 border border-white/5 shadow-lg space-y-4 max-w-2xl"
        >

          <input
            name="nome"
            placeholder="Nome da categoria"
            value={form.nome}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-[#13233f] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />

          <select
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-[#13233f] text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >

            <option value="receita">
              Receita
            </option>

            <option value="despesa">
              Despesa
            </option>

          </select>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 transition font-semibold"
          >

            {editandoId
              ? 'Atualizar Categoria'
              : 'Adicionar Categoria'}

          </button>

        </form>

        {/* tabela */}
        <div className="mt-10 bg-[#0f2342] rounded-2xl border border-white/5 shadow-lg overflow-hidden">

          <table className="w-full">

            <thead className="bg-[#13233f] text-gray-300">

              <tr>

                <th className="p-4 text-left">
                  Nome
                </th>

                <th className="p-4 text-left">
                  Tipo
                </th>

                <th className="p-4 text-left">
                  Ações
                </th>

              </tr>

            </thead>

            <tbody>

              {categorias.map((categoria) => (

                <tr
                  key={categoria.id}
                  className="border-t border-white/5 hover:bg-white/5 transition"
                >

                  <td className="p-4 font-medium">
                    {categoria.nome}
                  </td>

                  <td className="p-4 capitalize">

                    <span
                      className={
                        categoria.tipo === 'receita'
                          ? 'text-emerald-400'
                          : 'text-red-400'
                      }
                    >
                      {categoria.tipo}
                    </span>

                  </td>

                  <td className="p-4">

                    <div className="flex gap-3">

                      <button
                        onClick={() => handleEditar(categoria)}
                        className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 transition"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => handleExcluir(categoria.id)}
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

export default Categorias