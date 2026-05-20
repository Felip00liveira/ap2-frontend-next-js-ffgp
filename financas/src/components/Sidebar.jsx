import { useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  PlusCircle,
  Target,
  Wallet,
  BarChart3,
  LogOut,
  Landmark,
  ArrowLeftRight,
  Tags
} from 'lucide-react'

function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  function handleLogout() {
    localStorage.removeItem('auth')
    navigate('/login')
  }

  const menu = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard
    },
    {
      label: 'Transações',
      path: '/transacao',
      icon: PlusCircle
    },
    {
      label: 'Contas',
      path: '/contas',
      icon: Landmark
    },
    {
      label: 'Categorias',
      path: '/categorias',
      icon: Tags
    }
    
  ]

  return (
    <aside className="w-64 bg-[#081529]/95 border-r border-white/5 p-6 flex flex-col justify-between">
      <div>
        <h1 className="text-2xl font-bold text-emerald-400 mb-10">
          SeuApp
        </h1>

        <nav className="space-y-3">
          {menu.map((item) => {
            const Icon = item.icon
            const active = location.pathname === item.path

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition duration-300 ${
                  active
                    ? 'bg-[#13233f] text-emerald-400'
                    : 'hover:bg-[#13233f] text-white'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#13233f] hover:bg-red-500/20 text-red-400 transition"
      >
        <LogOut size={18} />
        <span>Sair</span>
      </button>
    </aside>
  )
}

export default Sidebar