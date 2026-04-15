import { useState } from 'react'
import { ChevronDown, ChevronUp, Footprints, Dumbbell, BookOpen, Table2, Lightbulb, Info } from 'lucide-react'
import { RUN_DURATIONS, WEEKLY_TEMPLATES, EXERCISE_LIBRARY, TIER_LABELS } from '../data/program'

function Section({ title, icon, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl mb-3 overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-4 text-left"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex items-center gap-3">
          <div className="text-orange-500">{icon}</div>
          <span className="font-bold text-white text-sm">{title}</span>
        </div>
        {open ? (
          <ChevronUp size={18} className="text-gray-500 flex-shrink-0" />
        ) : (
          <ChevronDown size={18} className="text-gray-500 flex-shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-4 pb-5 border-t border-gray-800 pt-4 text-sm text-gray-300 leading-relaxed space-y-3">
          {children}
        </div>
      )}
    </div>
  )
}

function TierBadge({ tier }) {
  return (
    <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full ${
      tier === 1 ? 'bg-green-500/20 text-green-400' :
      tier === 2 ? 'bg-blue-500/20 text-blue-400' :
      'bg-purple-500/20 text-purple-400'
    }`}>
      {TIER_LABELS[tier]}
    </span>
  )
}

function RunTable({ tier }) {
  const weeks = RUN_DURATIONS[tier]
  const hasRun3 = tier !== 1

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="text-left py-2 pr-3 text-gray-500 font-semibold w-10">Wk</th>
            <th className="text-center py-2 px-1 text-gray-500 font-semibold">Run 1</th>
            <th className="text-center py-2 px-1 text-gray-500 font-semibold">Run 2</th>
            {hasRun3 && <th className="text-center py-2 px-1 text-gray-500 font-semibold">Run 3</th>}
            <th className="text-center py-2 px-1 text-gray-500 font-semibold">Long</th>
          </tr>
        </thead>
        <tbody>
          {weeks.map((wk) => (
            <tr key={wk.week} className="border-b border-gray-800/50">
              <td className="py-2 pr-3 text-orange-400 font-bold">{wk.week}</td>
              <td className="text-center py-2 px-1 text-gray-300">{wk.run1}</td>
              <td className="text-center py-2 px-1 text-gray-300">{wk.run2}</td>
              {hasRun3 && <td className="text-center py-2 px-1 text-gray-300">{wk.run3}</td>}
              <td className="text-center py-2 px-1 text-blue-400 font-semibold">{wk.long}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const DAY_ORDER = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function ScheduleTable({ tier }) {
  const tmpl = WEEKLY_TEMPLATES[tier]
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="text-left py-2 pr-2 text-gray-500 font-semibold">Day</th>
            <th className="text-left py-2 px-1 text-gray-500 font-semibold">AM</th>
            <th className="text-left py-2 px-1 text-gray-500 font-semibold">PM</th>
          </tr>
        </thead>
        <tbody>
          {tmpl.map((day, idx) => (
            <tr key={idx} className="border-b border-gray-800/50">
              <td className="py-2 pr-2 text-orange-400 font-bold">{day.dayName}</td>
              <td className="py-2 px-1 text-gray-300">
                {day.am ? (
                  <span className={day.am.type === 'run' ? 'text-orange-300' : 'text-blue-300'}>
                    {day.am.label}
                  </span>
                ) : (
                  <span className="text-gray-600">—</span>
                )}
              </td>
              <td className="py-2 px-1 text-gray-300">
                {day.pm ? (
                  <span className={day.pm.type === 'run' ? 'text-orange-300' : 'text-blue-300'}>
                    {day.pm.type === 'gym' ? day.pm.gymLabel : day.pm.label}
                  </span>
                ) : (
                  <span className="text-gray-600">—</span>
                )}
                {day.activeRecovery && <span className="text-blue-400 ml-1">(AR)</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function Guide() {
  const [scheduleTier, setScheduleTier] = useState(1)
  const [runTier, setRunTier] = useState(1)

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-24">
      <div className="px-4 pt-5 pb-4">
        <h1 className="text-xl font-black text-white">Program Guide</h1>
        <p className="text-xs text-gray-500 mt-0.5">Reference material for your training</p>
      </div>

      <div className="px-4">
        {/* Program Overview */}
        <Section title="Program Overview" icon={<Info size={18} />} defaultOpen>
          <p>
            Hybrid Blueprint is an 8-week hybrid training program designed to develop both aerobic endurance
            and functional strength simultaneously. It is structured around three progressive tiers:
          </p>
          <div className="space-y-3">
            {[1, 2, 3].map((t) => (
              <div key={t} className="bg-gray-800/60 rounded-xl p-3">
                <TierBadge tier={t} />
                <p className="mt-2 text-gray-300">
                  {t === 1 && 'Entry level. 3 runs per week combined with 4–5 gym sessions. Ideal for athletes transitioning into hybrid training or returning from a period off.'}
                  {t === 2 && 'Advanced. 4 runs per week (including quality/tempo sessions) combined with 4–5 gym sessions. For athletes with established fitness in both domains.'}
                  {t === 3 && 'Advanced+. Maximum volume. 4 runs per week (including race-pace circuit sessions on Sunday) plus 5 gym sessions. For experienced hybrid athletes ready to peak performance.'}
                </p>
              </div>
            ))}
          </div>
          <p className="text-gray-500 text-xs">
            The program uses a periodisation model: volume builds over 8 weeks with planned deload adjustments. Each week, you complete a combination of AM run sessions and PM gym sessions to build both systems without compromising recovery.
          </p>
        </Section>

        {/* Running Guidelines */}
        <Section title="Running Guidelines" icon={<Footprints size={18} />}>
          <div className="space-y-4">
            <div className="bg-gray-800/60 rounded-xl p-3">
              <h4 className="font-bold text-orange-400 mb-1">Easy Runs</h4>
              <p className="text-gray-400">
                Run at a fully conversational pace — you should be able to speak in complete sentences. This typically corresponds to 65–75% of max heart rate. Easy runs build your aerobic base without taxing recovery. Never push these.
              </p>
            </div>
            <div className="bg-gray-800/60 rounded-xl p-3">
              <h4 className="font-bold text-yellow-400 mb-1">Quality / Tempo Runs</h4>
              <p className="text-gray-400">
                These are structured hard efforts — tempo intervals, fartlek, or track repeats. Run at a comfortably hard pace (roughly 80–88% of max HR) where you can speak only a few words. Quality sessions develop lactate threshold and running economy.
              </p>
            </div>
            <div className="bg-gray-800/60 rounded-xl p-3">
              <h4 className="font-bold text-blue-400 mb-1">Long Runs</h4>
              <p className="text-gray-400">
                Weekly long runs are done at an easy pace (conversational). They progressively increase in distance over the 8 weeks to build aerobic endurance and fat-burning capacity. Do not race these.
              </p>
            </div>
            {[1, 2, 3].includes(3) && (
              <div className="bg-gray-800/60 rounded-xl p-3">
                <h4 className="font-bold text-purple-400 mb-1">Race Circuits (Tier 3 only)</h4>
                <p className="text-gray-400">
                  Sunday AM sessions for Tier 3. These combine running at race pace with bodyweight strength circuits. Designed to simulate race conditions and build the capacity to run hard when fatigued.
                </p>
              </div>
            )}
          </div>
        </Section>

        {/* Gym Workout Descriptions */}
        <Section title="Gym Workout Descriptions" icon={<Dumbbell size={18} />}>
          <div className="space-y-3">
            {Object.entries(EXERCISE_LIBRARY).map(([key, workout]) => (
              <div key={key} className="bg-gray-800/60 rounded-xl p-3">
                <h4 className="font-bold text-blue-300 mb-2">{workout.label}</h4>
                <div className="flex flex-wrap gap-1">
                  {workout.exercises.map((ex) => (
                    <span key={ex} className="text-xs bg-gray-700 text-gray-300 rounded px-2 py-0.5">
                      {ex}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {key === 'full' && 'A comprehensive full-body session targeting all major muscle groups. Ideal for days when you need broad stimulus without isolation work.'}
                  {key === 'push' && 'Focuses on chest, shoulders, and triceps. Emphasises pressing strength and shoulder health through varied angles.'}
                  {key === 'legs' && 'Lower body hypertrophy and strength. Prioritises the quads, hamstrings, and calves for both performance and injury resilience.'}
                  {key === 'arms' && 'Targeted bicep and tricep volume. Performed after major compound days so it does not interfere with primary lifts.'}
                  {key === 'shoulders_chest' && 'Shoulder and chest focus with added face pulls and rear delt work for joint health. Pairs well with active recovery on Sunday.'}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* Weekly Schedule Tables */}
        <Section title="Weekly Schedule Tables" icon={<Table2 size={18} />}>
          <div className="flex gap-2 mb-4">
            {[1, 2, 3].map((t) => (
              <button
                key={t}
                onClick={() => setScheduleTier(t)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  scheduleTier === t ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                T{t}
              </button>
            ))}
          </div>
          <TierBadge tier={scheduleTier} />
          <div className="mt-3">
            <ScheduleTable tier={scheduleTier} />
          </div>
          <p className="text-xs text-gray-600 mt-2">AR = Active Recovery</p>
        </Section>

        {/* Run Duration Tables */}
        <Section title="Run Duration Tables" icon={<BookOpen size={18} />}>
          <div className="flex gap-2 mb-4">
            {[1, 2, 3].map((t) => (
              <button
                key={t}
                onClick={() => setRunTier(t)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  runTier === t ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                T{t}
              </button>
            ))}
          </div>
          <TierBadge tier={runTier} />
          <div className="mt-3">
            <RunTable tier={runTier} />
          </div>
          <p className="text-xs text-gray-600 mt-2">Long run distances shown in blue. Tier 3 Run 3 values are time-based targets.</p>
        </Section>

        {/* Tips */}
        <Section title="Training Tips" icon={<Lightbulb size={18} />}>
          <div className="space-y-3">
            {[
              {
                title: 'Nutrition',
                color: 'text-green-400',
                body: 'Fuel runs with easily digestible carbohydrates 60–90 minutes before. Post-run, prioritise protein (30–40g) to support muscle protein synthesis. On heavy double days, increase total caloric intake. Stay hydrated.',
              },
              {
                title: 'Recovery',
                color: 'text-blue-400',
                body: 'Sleep 7–9 hours. Schedule gym sessions for PM on run days where possible to separate stimuli. Active recovery (walking, light stretching, foam rolling) on Sundays accelerates recovery without adding fatigue.',
              },
              {
                title: 'Progression',
                color: 'text-orange-400',
                body: 'Add weight to lifts when you can complete all sets with good form and 1–2 reps in reserve. For runs, trust the schedule — the volume increases are planned. Don\'t add extra mileage.',
              },
              {
                title: 'Managing Fatigue',
                color: 'text-yellow-400',
                body: 'Some accumulated fatigue is normal. If performance drops significantly over 3+ days, sleep quality decreases, or mood/motivation suffers, take an extra rest day. Skipping one session is better than an overuse injury.',
              },
              {
                title: 'Double Days',
                color: 'text-purple-400',
                body: 'On AM + PM days, keep the AM run truly easy. Even if you feel good, resist the urge to push. Your PM gym session will benefit from a properly paced morning run.',
              },
              {
                title: 'Footwear & Kit',
                color: 'text-pink-400',
                body: 'Use dedicated running shoes (replaced every 400–500 miles). Rotate between two pairs if possible to extend lifespan and let foam decompress. Compression gear can aid recovery on back-to-back training days.',
              },
            ].map((tip, i) => (
              <div key={i} className="bg-gray-800/60 rounded-xl p-3">
                <h4 className={`font-bold mb-1.5 ${tip.color}`}>{tip.title}</h4>
                <p className="text-gray-400 text-xs leading-relaxed">{tip.body}</p>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  )
}
