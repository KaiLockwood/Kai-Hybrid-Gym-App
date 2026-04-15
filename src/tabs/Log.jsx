import { useState } from 'react'
import { Plus, X, ChevronDown, ChevronUp, Footprints, Dumbbell, Clock, MapPin, Star, Trash2, ChevronsUpDown } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { EXERCISE_LIBRARY, WEEKLY_TEMPLATES, RUN_DURATIONS } from '../data/program'
import { todayISO, getProgramWeek, fullDate, parseISODate } from '../utils/dateUtils'

// ─── Helper: suggested run for today ──────────────────────────────────────────

function getSuggestedRun(tier, startDate) {
  if (!tier || !startDate) return null
  const week = getProgramWeek(startDate)
  if (!week) return null
  const tmpl = WEEKLY_TEMPLATES[tier]
  if (!tmpl) return null
  const today = new Date()
  // 0=Sun,1=Mon…6=Sat → template index 0=Mon…6=Sun
  const jsDay = today.getDay()
  const idx = jsDay === 0 ? 6 : jsDay - 1
  const day = tmpl[idx]
  if (!day) return null
  const runSlot = day.am?.type === 'run' ? day.am : day.pm?.type === 'run' ? day.pm : null
  if (!runSlot) return null
  const durations = RUN_DURATIONS[tier]?.[Math.min(week, 8) - 1]
  const dist = durations?.[runSlot.runKey]
  return { label: runSlot.label, dist }
}

// ─── Run Log Modal ─────────────────────────────────────────────────────────────

function RunLogModal({ onSave, onClose, tier, startDate }) {
  const suggested = getSuggestedRun(tier, startDate)
  const [runType, setRunType] = useState(suggested?.label?.toLowerCase().includes('long') ? 'long' : 'easy')
  const [duration, setDuration] = useState('')
  const [distance, setDistance] = useState(suggested?.dist?.replace('km', '').trim() || '')
  const [notes, setNotes] = useState('')
  const [rpe, setRpe] = useState(3)

  const subtypeMap = {
    easy: 'easy',
    quality: 'quality',
    long: 'long',
  }

  function handleSave() {
    if (!duration) return
    const entry = {
      id: uuidv4(),
      date: todayISO(),
      type: 'run',
      subtype: subtypeMap[runType] || 'easy',
      duration: parseInt(duration, 10),
      distance: distance ? parseFloat(distance) : null,
      rpe,
      notes,
      exercises: [],
    }
    onSave(entry)
    onClose()
  }

  return (
    <ModalShell title="Log a Run" onClose={onClose}>
      {suggested && (
        <div className="mb-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl">
          <p className="text-xs text-orange-300 font-semibold">Today's scheduled run</p>
          <p className="text-sm text-white font-medium">{suggested.label}{suggested.dist ? ` · ${suggested.dist}` : ''}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-xs text-gray-400 font-semibold mb-2 uppercase tracking-wider">Run Type</label>
          <div className="flex gap-2">
            {['easy', 'quality', 'long'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setRunType(t)}
                className={`flex-1 py-2 rounded-xl text-sm font-bold capitalize transition-all ${
                  runType === t ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-400 font-semibold mb-2 uppercase tracking-wider">Duration (min) *</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="45"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 font-semibold mb-2 uppercase tracking-wider">Distance (km)</label>
            <input
              type="number"
              step="0.1"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              placeholder="8.0"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-400 font-semibold mb-2 uppercase tracking-wider">Effort (RPE 1–5)</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setRpe(v)}
                className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
                  rpe === v ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-600 mt-1">{['', 'Very Easy', 'Easy', 'Moderate', 'Hard', 'Max'][rpe]}</p>
        </div>

        <div>
          <label className="block text-xs text-gray-400 font-semibold mb-2 uppercase tracking-wider">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How did it feel?"
            rows={2}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors resize-none text-sm"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={!duration}
          className="w-full py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-400 transition-colors disabled:opacity-40"
        >
          Save Run
        </button>
      </div>
    </ModalShell>
  )
}

// ─── Gym Log Modal ─────────────────────────────────────────────────────────────

function ExerciseRow({ exercise, sets, onChange }) {
  function updateSet(idx, field, val) {
    const next = sets.map((s, i) => i === idx ? { ...s, [field]: val } : s)
    onChange(next)
  }

  function addSet() {
    onChange([...sets, { weight: '', reps: '' }])
  }

  function removeSet(idx) {
    if (sets.length <= 1) return
    onChange(sets.filter((_, i) => i !== idx))
  }

  return (
    <div className="bg-gray-800/60 rounded-xl p-3 mb-3 border border-gray-700/50">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-bold text-white">{exercise}</h4>
        <button
          onClick={addSet}
          className="text-xs text-orange-400 font-bold hover:text-orange-300 transition-colors px-2 py-1 rounded bg-orange-500/10"
        >
          + Set
        </button>
      </div>
      <div className="space-y-1.5">
        {sets.map((set, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="text-[11px] text-gray-500 w-6 text-center font-bold">{idx + 1}</span>
            <div className="flex-1 flex gap-2">
              <div className="flex-1">
                <input
                  type="number"
                  value={set.weight}
                  onChange={(e) => updateSet(idx, 'weight', e.target.value)}
                  placeholder="kg"
                  className="w-full bg-gray-700 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  value={set.reps}
                  onChange={(e) => updateSet(idx, 'reps', e.target.value)}
                  placeholder="reps"
                  className="w-full bg-gray-700 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>
            {sets.length > 1 && (
              <button onClick={() => removeSet(idx)} className="text-gray-600 hover:text-red-400 transition-colors">
                <X size={14} />
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-8 mt-1 px-6">
        <span className="text-[10px] text-gray-600">Weight (kg)</span>
        <span className="text-[10px] text-gray-600">Reps</span>
      </div>
    </div>
  )
}

function GymLogModal({ onSave, onClose }) {
  const [workoutType, setWorkoutType] = useState('full')
  const [exerciseSets, setExerciseSets] = useState({})
  const [rpe, setRpe] = useState(3)
  const [notes, setNotes] = useState('')

  const workout = EXERCISE_LIBRARY[workoutType]

  function getExerciseSets(name) {
    return exerciseSets[name] || [{ weight: '', reps: '' }]
  }

  function handleExerciseChange(name, sets) {
    setExerciseSets((prev) => ({ ...prev, [name]: sets }))
  }

  function handleSave() {
    const exercises = workout.exercises.map((name) => ({
      name,
      sets: (exerciseSets[name] || [{ weight: '', reps: '' }])
        .filter((s) => s.weight || s.reps)
        .map((s) => ({
          weight: s.weight ? parseFloat(s.weight) : 0,
          reps: s.reps ? parseInt(s.reps, 10) : 0,
        })),
    })).filter((e) => e.sets.length > 0)

    const entry = {
      id: uuidv4(),
      date: todayISO(),
      type: 'gym',
      subtype: workoutType,
      duration: null,
      distance: null,
      rpe,
      notes,
      exercises,
    }
    onSave(entry)
    onClose()
  }

  return (
    <ModalShell title="Log Gym Session" onClose={onClose}>
      <div className="space-y-4">
        {/* Workout selector */}
        <div>
          <label className="block text-xs text-gray-400 font-semibold mb-2 uppercase tracking-wider">Workout</label>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(EXERCISE_LIBRARY).map(([key, val]) => (
              <button
                key={key}
                type="button"
                onClick={() => setWorkoutType(key)}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all ${
                  workoutType === key ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {val.label.replace(' Workout', '')}
              </button>
            ))}
          </div>
        </div>

        {/* Exercises */}
        <div>
          <label className="block text-xs text-gray-400 font-semibold mb-2 uppercase tracking-wider">
            {workout.label}
          </label>
          {workout.exercises.map((name) => (
            <ExerciseRow
              key={name}
              exercise={name}
              sets={getExerciseSets(name)}
              onChange={(s) => handleExerciseChange(name, s)}
            />
          ))}
        </div>

        {/* RPE */}
        <div>
          <label className="block text-xs text-gray-400 font-semibold mb-2 uppercase tracking-wider">Session RPE (1–5)</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setRpe(v)}
                className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
                  rpe === v ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs text-gray-400 font-semibold mb-2 uppercase tracking-wider">Session Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How was the session?"
            rows={2}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors resize-none text-sm"
          />
        </div>

        <button
          onClick={handleSave}
          className="w-full py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-400 transition-colors"
        >
          Save Session
        </button>
      </div>
    </ModalShell>
  )
}

// ─── Modal Shell ───────────────────────────────────────────────────────────────

function ModalShell({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-[430px] bg-gray-950 rounded-t-2xl shadow-2xl max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-800 flex-shrink-0">
          <h2 className="text-lg font-black text-white">{title}</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors">
            <X size={20} />
          </button>
        </div>
        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-5 py-4 pb-8">
          {children}
        </div>
      </div>
    </div>
  )
}

// ─── Log Entry Card ─────────────────────────────────────────────────────────────

function LogCard({ entry, onDelete }) {
  const [expanded, setExpanded] = useState(false)

  const isRun = entry.type === 'run'
  const subtypeLabel = isRun
    ? { easy: 'Easy Run', quality: 'Quality Run', long: 'Long Run' }[entry.subtype] || 'Run'
    : EXERCISE_LIBRARY[entry.subtype]?.label || entry.subtype

  const dateObj = parseISODate(entry.date)
  const dateStr = fullDate(dateObj)

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden mb-3">
      <button
        className="w-full px-4 py-3 flex items-center gap-3 text-left"
        onClick={() => setExpanded((e) => !e)}
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isRun ? 'bg-orange-500/15' : 'bg-blue-500/15'
        }`}>
          {isRun
            ? <Footprints size={20} className="text-orange-400" />
            : <Dumbbell size={20} className="text-blue-400" />
          }
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-white truncate">{subtypeLabel}</div>
          <div className="text-xs text-gray-500">{dateStr}</div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {isRun && entry.distance && (
            <span className="text-sm font-bold text-orange-400">{entry.distance}km</span>
          )}
          {isRun && entry.duration && (
            <span className="text-xs text-gray-500">{entry.duration}min</span>
          )}
          {!isRun && entry.exercises?.length > 0 && (
            <span className="text-xs text-gray-500">{entry.exercises.length} ex</span>
          )}
          {entry.rpe && (
            <div className="flex items-center gap-0.5">
              <Star size={11} className="text-yellow-400 fill-yellow-400" />
              <span className="text-xs text-gray-400">{entry.rpe}</span>
            </div>
          )}
          {expanded ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-800">
          <div className="pt-3 space-y-2">
            {isRun && (
              <div className="grid grid-cols-3 gap-2">
                {entry.duration && (
                  <StatPill icon={<Clock size={12} />} label="Duration" value={`${entry.duration}min`} />
                )}
                {entry.distance && (
                  <StatPill icon={<MapPin size={12} />} label="Distance" value={`${entry.distance}km`} />
                )}
                {entry.rpe && (
                  <StatPill icon={<Star size={12} />} label="RPE" value={`${entry.rpe}/5`} />
                )}
              </div>
            )}

            {!isRun && entry.exercises?.length > 0 && (
              <div className="space-y-2">
                {entry.exercises.map((ex, i) => (
                  <div key={i} className="bg-gray-800/60 rounded-lg px-3 py-2">
                    <div className="text-xs font-bold text-white mb-1">{ex.name}</div>
                    <div className="flex flex-wrap gap-1">
                      {ex.sets.map((s, j) => (
                        <span key={j} className="text-[10px] bg-gray-700 text-gray-300 rounded px-1.5 py-0.5">
                          {s.weight}kg × {s.reps}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
                {entry.rpe && (
                  <div className="flex items-center gap-2 pt-1">
                    <Star size={13} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-gray-400">Session RPE: {entry.rpe}/5</span>
                  </div>
                )}
              </div>
            )}

            {entry.notes && (
              <div className="bg-gray-800/40 rounded-lg px-3 py-2 mt-2">
                <p className="text-xs text-gray-400 italic">"{entry.notes}"</p>
              </div>
            )}

            <div className="flex justify-end pt-1">
              <button
                onClick={() => onDelete(entry.id)}
                className="flex items-center gap-1.5 text-xs text-red-400/70 hover:text-red-400 transition-colors py-1 px-2 rounded hover:bg-red-500/10"
              >
                <Trash2 size={13} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function StatPill({ icon, label, value }) {
  return (
    <div className="bg-gray-800 rounded-lg px-2 py-2 text-center">
      <div className="flex items-center justify-center gap-1 text-gray-400 mb-0.5">
        {icon}
        <span className="text-[10px] text-gray-500">{label}</span>
      </div>
      <div className="text-sm font-bold text-white">{value}</div>
    </div>
  )
}

// ─── Add Modal Picker ──────────────────────────────────────────────────────────

function AddModal({ onClose, onOpenRun, onOpenGym }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-[430px] bg-gray-900 rounded-t-2xl px-5 py-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-black text-white">Log Session</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800">
            <X size={20} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => { onClose(); onOpenRun() }}
            className="flex flex-col items-center justify-center gap-3 py-6 bg-orange-500/10 border border-orange-500/30 rounded-2xl hover:bg-orange-500/20 transition-all"
          >
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <Footprints size={26} className="text-orange-400" />
            </div>
            <div>
              <div className="text-white font-bold">Log a Run</div>
              <div className="text-xs text-gray-500">Distance & time</div>
            </div>
          </button>
          <button
            onClick={() => { onClose(); onOpenGym() }}
            className="flex flex-col items-center justify-center gap-3 py-6 bg-blue-500/10 border border-blue-500/30 rounded-2xl hover:bg-blue-500/20 transition-all"
          >
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Dumbbell size={26} className="text-blue-400" />
            </div>
            <div>
              <div className="text-white font-bold">Log Gym</div>
              <div className="text-xs text-gray-500">Sets & reps</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Log Tab ──────────────────────────────────────────────────────────────

export default function Log({ logs, onAddLog, onDeleteLog, tier, startDate }) {
  const [modal, setModal] = useState(null) // null | 'add' | 'run' | 'gym'

  const sortedLogs = [...logs].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className="px-4 pt-5 pb-4 flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-xl font-black text-white">Training Log</h1>
          <p className="text-xs text-gray-500 mt-0.5">{logs.length} session{logs.length !== 1 ? 's' : ''} logged</p>
        </div>
      </div>

      {/* Log list */}
      <div className="flex-1 overflow-y-auto px-4 pb-32">
        {sortedLogs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ChevronsUpDown size={28} className="text-gray-600" />
            </div>
            <p className="text-gray-500 font-medium">No sessions logged yet.</p>
            <p className="text-sm text-gray-600 mt-1">Tap the + button to log your first session.</p>
          </div>
        ) : (
          sortedLogs.map((entry) => (
            <LogCard key={entry.id} entry={entry} onDelete={onDeleteLog} />
          ))
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setModal('add')}
        className="fixed bottom-20 right-4 z-30 w-14 h-14 bg-orange-500 rounded-full shadow-lg shadow-orange-500/30 flex items-center justify-center hover:bg-orange-400 active:scale-95 transition-all"
        style={{ maxWidth: 'calc(430px - 16px)', right: 'max(16px, calc(50vw - 215px + 16px))' }}
      >
        <Plus size={28} className="text-white" />
      </button>

      {/* Modals */}
      {modal === 'add' && (
        <AddModal
          onClose={() => setModal(null)}
          onOpenRun={() => setModal('run')}
          onOpenGym={() => setModal('gym')}
        />
      )}
      {modal === 'run' && (
        <RunLogModal
          onSave={onAddLog}
          onClose={() => setModal(null)}
          tier={tier}
          startDate={startDate}
        />
      )}
      {modal === 'gym' && (
        <GymLogModal
          onSave={onAddLog}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
