import { useState } from 'react'
import { Settings } from 'lucide-react'
import { useLocalStorage } from './hooks/useLocalStorage'
import BottomNav from './components/BottomNav'
import SettingsModal from './components/SettingsModal'
import Onboarding from './components/Onboarding'
import Schedule from './tabs/Schedule'
import Log from './tabs/Log'
import Progress from './tabs/Progress'
import Guide from './tabs/Guide'

export default function App() {
  const [tier, setTier] = useLocalStorage('hb_tier', null)
  const [startDate, setStartDate] = useLocalStorage('hb_start_date', null)
  const [logs, setLogs] = useLocalStorage('hb_logs', [])
  const [sessionStatus, setSessionStatus] = useLocalStorage('hb_session_status', {})

  const [activeTab, setActiveTab] = useState(0)
  const [showSettings, setShowSettings] = useState(false)

  // ── Onboarding ────────────────────────────────────────────────────────────
  if (!tier || !startDate) {
    return (
      <Onboarding
        onComplete={(selectedTier, selectedDate) => {
          setTier(selectedTier)
          setStartDate(selectedDate)
        }}
      />
    )
  }

  // ── Session status toggle ──────────────────────────────────────────────────
  function handleSessionToggle(slotKey, action) {
    setSessionStatus((prev) => {
      const current = prev[slotKey]
      if (action === 'done') {
        return { ...prev, [slotKey]: current === 'done' ? undefined : 'done' }
      } else if (action === 'skip') {
        return { ...prev, [slotKey]: current === 'skipped' ? undefined : 'skipped' }
      }
      return prev
    })
  }

  // ── Log management ─────────────────────────────────────────────────────────
  function handleAddLog(entry) {
    setLogs((prev) => [...prev, entry])
  }

  function handleDeleteLog(id) {
    setLogs((prev) => prev.filter((l) => l.id !== id))
  }

  // ── Settings save ──────────────────────────────────────────────────────────
  function handleSettingsSave(newTier, newStartDate) {
    setTier(newTier)
    setStartDate(newStartDate)
  }

  return (
    <div className="flex justify-center min-h-screen bg-gray-950 overflow-x-hidden">
      <div className="w-full max-w-[430px] min-h-screen bg-gray-950 relative flex flex-col overflow-x-hidden">
        {/* Top bar — respects Dynamic Island / status bar via safe-area-inset-top */}
        <div
          className="flex items-center justify-between px-4 pb-1 flex-shrink-0"
          style={{ paddingTop: 'max(env(safe-area-inset-top), 16px)' }}
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-orange-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-[10px] font-black">HB</span>
            </div>
            <span className="text-white font-black text-sm tracking-tight">Hybrid Blueprint</span>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
            style={{ minWidth: 44, minHeight: 44 }}
          >
            <Settings size={20} />
          </button>
        </div>

        {/* Tab content — pb accounts for nav height + home indicator */}
        <div className="flex-1 overflow-hidden">
          <div
            className="h-full overflow-y-auto"
            style={{ paddingBottom: 'calc(4rem + env(safe-area-inset-bottom) + 16px)' }}
          >
            {activeTab === 0 && (
              <Schedule
                tier={tier}
                startDate={startDate}
                sessionStatus={sessionStatus}
                onSessionToggle={handleSessionToggle}
              />
            )}
            {activeTab === 1 && (
              <Log
                logs={logs}
                onAddLog={handleAddLog}
                onDeleteLog={handleDeleteLog}
                tier={tier}
                startDate={startDate}
              />
            )}
            {activeTab === 2 && (
              <Progress logs={logs} />
            )}
            {activeTab === 3 && (
              <Guide />
            )}
          </div>
        </div>

        {/* Bottom navigation */}
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Settings modal */}
        {showSettings && (
          <SettingsModal
            tier={tier}
            startDate={startDate}
            onSave={handleSettingsSave}
            onClose={() => setShowSettings(false)}
          />
        )}
      </div>
    </div>
  )
}
