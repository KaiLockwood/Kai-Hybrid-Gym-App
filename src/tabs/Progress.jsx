import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from 'recharts'
import { Footprints, Dumbbell, Flame, Trophy, TrendingUp } from 'lucide-react'
import { getLastNWeekMondays, toISODate, parseISODate, calcStreaks } from '../utils/dateUtils'
import { EXERCISE_LIBRARY } from '../data/program'

// ─── Custom Tooltip ────────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label, unit = '' }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-gray-400 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || '#f97316' }} className="font-bold">
          {p.name}: {p.value}{unit}
        </p>
      ))}
    </div>
  )
}

// ─── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, sub, color = 'text-orange-500' }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
      <div className={`mb-2 ${color}`}>{icon}</div>
      <div className="text-2xl font-black text-white">{value}</div>
      <div className="text-xs font-semibold text-gray-300 mt-0.5">{label}</div>
      {sub && <div className="text-xs text-gray-600 mt-0.5">{sub}</div>}
    </div>
  )
}

// ─── Weekly Mileage Chart ──────────────────────────────────────────────────────

function WeeklyMileageChart({ logs }) {
  const mondays = getLastNWeekMondays(8)

  const data = mondays.map((mondayISO) => {
    const monday = parseISODate(mondayISO)
    const sunday = new Date(monday)
    sunday.setDate(sunday.getDate() + 6)
    sunday.setHours(23, 59, 59, 999)

    const weekMiles = logs
      .filter((l) => l.type === 'run' && l.distance)
      .filter((l) => {
        const d = parseISODate(l.date)
        return d >= monday && d <= sunday
      })
      .reduce((acc, l) => acc + (l.distance || 0), 0)

    const label = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(monday)
    return { week: label, miles: parseFloat(weekMiles.toFixed(1)) }
  })

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-4">
      <h3 className="text-sm font-bold text-white mb-4">Weekly Mileage</h3>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
          <XAxis dataKey="week" tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip unit="mi" />} cursor={{ fill: 'rgba(249,115,22,0.08)' }} />
          <Bar dataKey="miles" fill="#f97316" radius={[4, 4, 0, 0]} name="Miles" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// ─── Gym Volume Chart ──────────────────────────────────────────────────────────

function GymVolumeChart({ logs }) {
  const mondays = getLastNWeekMondays(8)

  const gymLogs = logs.filter((l) => l.type === 'gym')

  const workoutColors = {
    full: '#f97316',
    push: '#3b82f6',
    legs: '#22c55e',
    arms: '#a855f7',
    shoulders_chest: '#ec4899',
  }

  const data = mondays.map((mondayISO) => {
    const monday = parseISODate(mondayISO)
    const sunday = new Date(monday)
    sunday.setDate(sunday.getDate() + 6)
    sunday.setHours(23, 59, 59, 999)

    const weekLogs = gymLogs.filter((l) => {
      const d = parseISODate(l.date)
      return d >= monday && d <= sunday
    })

    const row = {
      week: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(monday),
    }

    Object.keys(workoutColors).forEach((subtype) => {
      const count = weekLogs.filter((l) => l.subtype === subtype).length
      row[subtype] = count
    })

    return row
  })

  const hasAnyData = data.some((d) =>
    Object.keys(workoutColors).some((k) => d[k] > 0)
  )

  if (!hasAnyData) return null

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-4">
      <h3 className="text-sm font-bold text-white mb-4">Gym Sessions by Type</h3>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
          <XAxis dataKey="week" tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(249,115,22,0.08)' }} />
          {Object.entries(workoutColors).map(([key, color]) => (
            <Bar key={key} dataKey={key} stackId="gym" fill={color} name={EXERCISE_LIBRARY[key]?.label || key} />
          ))}
        </BarChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-2 mt-3">
        {Object.entries(workoutColors).map(([key, color]) => (
          <div key={key} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-[10px] text-gray-500">{EXERCISE_LIBRARY[key]?.label || key}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Run Distance Over Time ────────────────────────────────────────────────────

function RunTrendChart({ logs }) {
  const runLogs = logs
    .filter((l) => l.type === 'run' && l.distance)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-20)

  if (runLogs.length < 2) return null

  const data = runLogs.map((l) => ({
    date: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(parseISODate(l.date)),
    distance: l.distance,
    subtype: l.subtype,
  }))

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-4">
      <h3 className="text-sm font-bold text-white mb-4">Run Distance Trend</h3>
      <ResponsiveContainer width="100%" height={140}>
        <LineChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip unit="mi" />} />
          <Line
            type="monotone"
            dataKey="distance"
            stroke="#f97316"
            strokeWidth={2}
            dot={{ fill: '#f97316', r: 3 }}
            activeDot={{ r: 5 }}
            name="Distance"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// ─── Main Progress Tab ─────────────────────────────────────────────────────────

export default function Progress({ logs }) {
  const runLogs = logs.filter((l) => l.type === 'run')
  const gymLogs = logs.filter((l) => l.type === 'gym')

  const totalRunTime = runLogs.reduce((acc, l) => acc + (l.duration || 0), 0)
  const totalMiles = runLogs.reduce((acc, l) => acc + (l.distance || 0), 0)

  // MPW: average miles per week over last 4 weeks
  const mondays4 = getLastNWeekMondays(4)
  const weeklyMiles = mondays4.map((mondayISO) => {
    const monday = parseISODate(mondayISO)
    const sunday = new Date(monday)
    sunday.setDate(sunday.getDate() + 6)
    sunday.setHours(23, 59, 59, 999)
    return runLogs
      .filter((l) => l.distance)
      .filter((l) => {
        const d = parseISODate(l.date)
        return d >= monday && d <= sunday
      })
      .reduce((acc, l) => acc + l.distance, 0)
  })
  const mpw = weeklyMiles.length > 0
    ? (weeklyMiles.reduce((a, b) => a + b, 0) / weeklyMiles.length).toFixed(1)
    : 0

  const { current: streakCurrent, longest: streakLongest } = calcStreaks(logs)

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-24">
      {/* Header */}
      <div className="px-4 pt-5 pb-4 flex-shrink-0">
        <h1 className="text-xl font-black text-white">Progress</h1>
        <p className="text-xs text-gray-500 mt-0.5">Your training stats</p>
      </div>

      <div className="px-4">
        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <StatCard
            icon={<Footprints size={20} />}
            label="Total Runs"
            value={runLogs.length}
            sub={`${totalMiles.toFixed(1)} mi total`}
            color="text-orange-500"
          />
          <StatCard
            icon={<Dumbbell size={20} />}
            label="Gym Sessions"
            value={gymLogs.length}
            color="text-blue-400"
          />
          <StatCard
            icon={<TrendingUp size={20} />}
            label="Avg MPW"
            value={`${mpw}mi`}
            sub="4-week average"
            color="text-green-400"
          />
          <StatCard
            icon={<Flame size={20} />}
            label="Run Time"
            value={totalRunTime >= 60 ? `${Math.floor(totalRunTime / 60)}h` : `${totalRunTime}m`}
            sub={totalRunTime >= 60 ? `${totalRunTime % 60}min extra` : 'total'}
            color="text-red-400"
          />
        </div>

        {/* Streak */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Trophy size={18} className="text-yellow-400" />
            <h3 className="text-sm font-bold text-white">Streaks</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center bg-gray-800/50 rounded-xl py-3">
              <div className="text-3xl font-black text-orange-500">{streakCurrent}</div>
              <div className="text-xs text-gray-400 mt-0.5">Current Streak</div>
              <div className="text-[10px] text-gray-600">days</div>
            </div>
            <div className="text-center bg-gray-800/50 rounded-xl py-3">
              <div className="text-3xl font-black text-yellow-400">{streakLongest}</div>
              <div className="text-xs text-gray-400 mt-0.5">Longest Streak</div>
              <div className="text-[10px] text-gray-600">days</div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <WeeklyMileageChart logs={logs} />
        <GymVolumeChart logs={logs} />
        <RunTrendChart logs={logs} />

        {logs.length === 0 && (
          <div className="text-center py-10">
            <div className="text-gray-600 mb-2">No data yet.</div>
            <p className="text-sm text-gray-700">Log your first session to see progress charts.</p>
          </div>
        )}
      </div>
    </div>
  )
}
