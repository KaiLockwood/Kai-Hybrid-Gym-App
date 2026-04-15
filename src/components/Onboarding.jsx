import { useState } from 'react'
import { Activity, Check, ChevronRight } from 'lucide-react'
import { TIER_LABELS } from '../data/program'

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0)
  const [selectedTier, setSelectedTier] = useState(null)
  const [startDate, setStartDate] = useState('')

  const tierDescriptions = {
    1: {
      runs: '3 runs/week',
      gym: '4–5 gym sessions',
      detail: 'Best for those new to hybrid training or returning from a break. Focused, manageable volume.',
    },
    2: {
      runs: '4 runs/week',
      gym: '4–5 gym sessions',
      detail: 'For athletes with a solid base in both running and lifting. Higher volume, quality run days.',
    },
    3: {
      runs: '4 runs/week + circuits',
      gym: '5 gym sessions',
      detail: 'Maximum volume for experienced hybrid athletes. Includes race-pace circuit training.',
    },
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-[400px]">
        {step === 0 && (
          <div className="text-center">
            <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-orange-500/10 border border-orange-500/30 mx-auto mb-6">
              <Activity size={40} className="text-orange-500" />
            </div>
            <h1 className="text-3xl font-black text-white mb-2 tracking-tight">
              Hybrid Blueprint
            </h1>
            <p className="text-gray-400 mb-2">
              Your 8-week hybrid training program
            </p>
            <p className="text-sm text-gray-500 mb-10">
              Combining running endurance with strength training for peak hybrid performance.
            </p>
            <button
              onClick={() => setStep(1)}
              className="w-full py-4 bg-orange-500 text-white font-bold rounded-2xl text-lg hover:bg-orange-400 transition-colors flex items-center justify-center gap-2"
            >
              Get Started <ChevronRight size={20} />
            </button>
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="mb-8">
              <p className="text-orange-500 text-sm font-bold tracking-widest uppercase mb-2">Step 1 of 2</p>
              <h2 className="text-2xl font-black text-white mb-2">Choose Your Tier</h2>
              <p className="text-gray-400 text-sm">
                Select based on your current fitness level and available training time.
              </p>
            </div>

            <div className="space-y-3 mb-8">
              {[1, 2, 3].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedTier(t)}
                  className={`w-full text-left px-4 py-4 rounded-2xl border transition-all ${
                    selectedTier === t
                      ? 'border-orange-500 bg-orange-500/10'
                      : 'border-gray-800 bg-gray-900 hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className={`font-bold text-base ${selectedTier === t ? 'text-white' : 'text-gray-200'}`}>
                        {TIER_LABELS[t]}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {tierDescriptions[t].runs} · {tierDescriptions[t].gym}
                      </div>
                      <div className={`text-sm mt-2 ${selectedTier === t ? 'text-gray-300' : 'text-gray-500'}`}>
                        {tierDescriptions[t].detail}
                      </div>
                    </div>
                    <div className={`ml-3 mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                      selectedTier === t ? 'border-orange-500 bg-orange-500' : 'border-gray-600'
                    }`}>
                      {selectedTier === t && <Check size={12} className="text-white" />}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <button
              disabled={!selectedTier}
              onClick={() => setStep(2)}
              className="w-full py-4 bg-orange-500 text-white font-bold rounded-2xl text-lg hover:bg-orange-400 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
            >
              Continue <ChevronRight size={20} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="mb-8">
              <p className="text-orange-500 text-sm font-bold tracking-widest uppercase mb-2">Step 2 of 2</p>
              <h2 className="text-2xl font-black text-white mb-2">Program Start Date</h2>
              <p className="text-gray-400 text-sm">
                When did (or will) your 8-week program begin? This is used to calculate your current week.
              </p>
            </div>

            <div className="bg-gray-900 rounded-2xl p-4 mb-4 border border-gray-800">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                <span className="text-sm font-semibold text-gray-300">Selected Tier</span>
              </div>
              <p className="text-white font-bold ml-5">{TIER_LABELS[selectedTier]}</p>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors text-base"
              />
              <p className="text-xs text-gray-500 mt-2">
                You can always update this in Settings later.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-4 rounded-2xl border border-gray-700 text-gray-300 font-semibold hover:bg-gray-900 transition-colors"
              >
                Back
              </button>
              <button
                disabled={!startDate}
                onClick={() => onComplete(selectedTier, startDate)}
                className="flex-1 py-4 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-400 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
              >
                Start Program <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
