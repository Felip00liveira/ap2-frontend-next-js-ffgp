import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '/services/api'

function Register() {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    password: '',
    telefone: '',
    cpf: '',
    data_nascimento: ''
  })

  const navigate = useNavigate()

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      const response = await api.post('/users/', form)

      console.log('Usuário cadastrado:', response.data)

      alert('Cadastro realizado com sucesso!')

      navigate('/login')
    } catch (error) {
      console.error(error)

      alert('Erro ao cadastrar usuário')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#07142b] via-[#0c1f42] to-[#06142b] px-4">
      <div className="w-full max-w-md bg-[#0b1830]/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/5">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-400">SeuApp</h1>

          <p className="text-gray-400 text-sm mt-1">
            Crie sua conta
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="nome"
            placeholder="Nome completo"
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-[#13233f] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-[#13233f] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />

          <input
            name="password"
            type="password"
            placeholder="Senha"
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-[#13233f] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />

          <input
            name="telefone"
            placeholder="Telefone"
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-[#13233f] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />

          <input
            name="cpf"
            placeholder="CPF"
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-[#13233f] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />

          <input
            name="data_nascimento"
            type="date"
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-[#13233f] text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 transition duration-300 text-white font-semibold shadow-lg"
          >
            Cadastrar
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-sm text-gray-400 hover:text-emerald-400 transition"
          >
            Voltar para login
          </button>
        </div>
      </div>
    </div>
  )
}

export default Register