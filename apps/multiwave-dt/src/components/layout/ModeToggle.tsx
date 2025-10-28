import { Sun, Moon, Map } from 'lucide-react'
import { useSceneModeStore, type SceneMode } from '../../stores/useSceneModeStore'

export function ModeToggle() {
  const { mode, setMode } = useSceneModeStore()

  const modes: { value: SceneMode; label: string; icon: React.ReactNode }[] = [
    { value: 'day', label: '주간', icon: <Sun className="h-4 w-4" /> },
    { value: 'night', label: '야간', icon: <Moon className="h-4 w-4" /> },
    { value: 'tactical', label: '작전', icon: <Map className="h-4 w-4" /> },
  ]

  return (
    <div className="flex gap-2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border">
      {modes.map((m) => (
        <button
          key={m.value}
          onClick={() => setMode(m.value)}
          className={`
            flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium
            transition-colors duration-200
            ${
              mode === m.value
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-100'
            }
          `}
        >
          {m.icon}
          <span>{m.label}</span>
        </button>
      ))}
    </div>
  )
}
