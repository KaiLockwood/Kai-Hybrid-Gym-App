import { Calendar, BookOpen, BarChart2, BookMarked } from 'lucide-react'

const TABS = [
  { id: 0, label: 'Schedule', icon: Calendar },
  { id: 1, label: 'Log',      icon: BookOpen },
  { id: 2, label: 'Progress', icon: BarChart2 },
  { id: 3, label: 'Guide',    icon: BookMarked },
]

export default function BottomNav({ activeTab, onTabChange }) {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-gray-900 border-t border-gray-800 z-40">
      <div className="flex items-stretch">
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 transition-colors ${
                active
                  ? 'text-orange-500'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
              <span className={`text-[10px] font-medium tracking-wide ${active ? 'text-orange-500' : 'text-gray-500'}`}>
                {label}
              </span>
              {active && (
                <span className="absolute bottom-0 w-8 h-0.5 bg-orange-500 rounded-t" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
