import { useState } from 'react'
import { X, Check } from 'lucide-react'
import { TIER_LABELS } from '../data/program'

function SettingsForm({ initialTier, initialStartDate, onSave, showCancel, onCancel }) {
  const [selectedTier, setSelectedTier] = useState(initialTier)
  const [selectedDate, setSelectedDate] = useState(initialStartDate || '')

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSave(selectedTier, selectedDate)
      }}
      className="space-y-6"
    >
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-3">
          Training Tier
        </label>
        <div className="space-y-2">
          {[1, 2, 3].map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => setSelectedTier(t)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                selectedTier === t
                  ? 'border-orange-500 bg-orange-500/10 text-white'
                  : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600'
              }`}
            >
              <div className="text-left">
                <div className="font-semibold">{TIER_LABELS[t]}</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {t === 1 && '3 runs/week · 4–5 gym sessions'}
                  {t === 2 && '4 runs/week · 4–5 gym sessions'}
                  {t === 3 && '4 runs/week · 5 gym sessions + circuits'}
                </div>
              </div>
              {selectedTier === t && (
                <Check size={18} className="text-orange-500 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          Program Start Date
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
        />
        <p className="text-xs text-gray-500 mt-1">
          Used to calculate your current program week.
        </p>
      </div>

      <div className="flex gap-3 pt-2">
        {showCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl border border-gray-700 text-gray-300 font-semibold hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={!selectedTier || !selectedDate}
          className="flex-1 py-3 rounded-xl bg-orange-500 text-white font-bold disabled:opacity-40 hover:bg-orange-400 transition-colors"
        >
          Save
        </button>
      </div>
    </form>
  )
}

export { SettingsForm }

export default function SettingsModal({ tier, startDate, onSave, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-[430px] bg-gray-900 rounded-t-2xl p-6 pb-10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <SettingsForm
          initialTier={tier}
          initialStartDate={startDate}
          onSave={(t, d) => { onSave(t, d); onClose() }}
          showCancel
          onCancel={onClose}
        />
      </div>
    </div>
  )
}
