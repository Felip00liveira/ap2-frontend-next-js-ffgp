import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '/services/api'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [erro, setErro] = useState('')

  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()

    setErro('')

    try {
      const response = await api.post('/login', {
        email,
        password
      })

      console.log(response.data)

      localStorage.setItem(
        'user',
        JSON.stringify(response.data.user)
      )

      navigate('/dashboard')

    } catch (error) {
      console.error(error)

      if (error.response) {
        setErro(error.response.data.detail)
      } else {
        setErro('Erro ao conectar com a API')
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#07142b] via-[#0c1f42] to-[#06142b]">
      <div className="w-full max-w-sm bg-[#0b1830]/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/5">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-400">
            SeuApp
          </h1>

          <p className="text-gray-400 text-sm mt-1">
            Faça login para continuar
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[#13233f] text-white placeholder-gray-500 border border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[#13233f] text-white placeholder-gray-500 border border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />

          {erro && (
            <p className="text-red-400 text-sm">
              {erro}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 transition duration-300 text-white font-semibold shadow-lg"
          >
            Entrar
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/cadastro')}
            className="text-sm text-gray-400 hover:text-emerald-400 transition"
          >
            Criar conta
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login