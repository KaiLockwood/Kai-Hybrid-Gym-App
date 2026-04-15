import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle, Moon, Zap, Footprints, Dumbbell } from 'lucide-react'
import { WEEKLY_TEMPLATES, RUN_DURATIONS, TIER_LABELS } from '../data/program'
import {
  getWeekDates,
  toISODate,
  shortMonthDay,
  getProgramWeek,
  todayISO,
} from '../utils/dateUtils'

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function getRunDist(tier, weekNum, runKey) {
  if (!tier || !weekNum || !runKey) return null
  const weeks = RUN_DURATIONS[tier]
  if (!weeks) return null
  const wk = weeks[Math.min(weekNum, 8) - 1]
  if (!wk) return null
  return wk[runKey] || null
}

function SessionChip({ session, dist, date, slotKey, status, onToggle }) {
  if (!session) return null
  const isDone = status === 'done'
  const isSkipped = status === 'skipped'

  const isRun = session.type === 'run'
  const label = isRun ? session.label : session.gymLabel

  return (
    <div className={`rounded-lg px-2 py-1.5 mb-1 border transition-all ${
      isDone
        ? 'bg-green-500/10 border-green-500/30'
        : isSkipped
        ? 'bg-gray-800/60 border-gray-700/50 opacity-60'
        : 'bg-gray-800/80 border-gray-700/50'
    }`}>
      <div className="flex items-center gap-1.5 mb-1">
        {isRun ? (
          <Footprints size={11} className={isDone ? 'text-green-400' : 'text-orange-400'} />
        ) : (
          <Dumbbell size={11} className={isDone ? 'text-green-400' : 'text-blue-400'} />
        )}
        <span className={`text-xs font-semibold truncate ${isDone ? 'text-green-300' : 'text-gray-200'}`}>
          {label}
        </span>
      </div>
      {dist && (
        <div className="text-[10px] text-orange-400/80 font-medium mb-1">{dist}</div>
      )}
      <div className="flex gap-1">
        <button
          onClick={() => onToggle(slotKey, 'done')}
          className={`flex-1 py-1 rounded text-[10px] font-bold transition-all ${
            isDone
              ? 'bg-green-500 text-white'
              : 'bg-gray-700 text-gray-400 hover:bg-green-500/20 hover:text-green-400'
          }`}
        >
          {isDone ? '✓ Done' : 'Done'}
        </button>
        <button
          onClick={() => onToggle(slotKey, 'skip')}
          className={`flex-1 py-1 rounded text-[10px] font-bold transition-all ${
            isSkipped
              ? 'bg-gray-600 text-gray-300'
              : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-gray-300'
          }`}
        >
          Skip
        </button>
      </div>
    </div>
  )
}

function DayCard({ dayTemplate, date, weekNum, tier, sessionStatus, onToggle }) {
  const iso = toISODate(date)
  const todayStr = todayISO()
  const isToday = iso === todayStr
  const isPast = iso < todayStr

  const amKey = `${iso}_am`
  const pmKey = `${iso}_pm`
  const amStatus = sessionStatus[amKey]
  const pmStatus = sessionStatus[pmKey]

  const amDist = dayTemplate.am
    ? getRunDist(tier, weekNum, dayTemplate.am.runKey)
    : null
  const pmDist = dayTemplate.pm
    ? getRunDist(tier, weekNum, dayTemplate.pm?.runKey)
    : null

  const hasAnything = dayTemplate.am || dayTemplate.pm

  return (
    <div
      className={`flex-shrink-0 w-44 rounded-2xl border transition-all ${
        isToday
          ? 'border-orange-500/60 bg-gray-900'
          : isPast
          ? 'border-gray-800/60 bg-gray-900/60'
          : 'border-gray-800 bg-gray-900'
      }`}
    >
      {/* Day header */}
      <div className={`px-3 pt-3 pb-2 border-b ${isToday ? 'border-orange-500/20' : 'border-gray-800'}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className={`text-xs font-bold tracking-widest uppercase ${isToday ? 'text-orange-500' : 'text-gray-400'}`}>
              {dayTemplate.dayName}
            </div>
            <div className={`text-sm font-semibold ${isToday ? 'text-white' : 'text-gray-300'}`}>
              {shortMonthDay(date)}
            </div>
          </div>
          {isToday && (
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          )}
          {dayTemplate.activeRecovery && (
            <Moon size={14} className="text-blue-400" />
          )}
        </div>
      </div>

      {/* Sessions */}
      <div className="p-2">
        {!hasAnything ? (
          <div className="text-center py-4">
            <div className="text-gray-600 text-xs">Rest Day</div>
          </div>
        ) : (
          <>
            {dayTemplate.am && (
              <div>
                <div className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mb-1 px-1">AM</div>
                <SessionChip
                  session={dayTemplate.am}
                  dist={amDist}
                  date={iso}
                  slotKey={amKey}
                  status={amStatus}
                  onToggle={onToggle}
                />
              </div>
            )}
            {dayTemplate.pm && (
              <div>
                <div className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mb-1 px-1">PM</div>
                <SessionChip
                  session={dayTemplate.pm}
                  dist={pmDist}
                  date={iso}
                  slotKey={pmKey}
                  status={pmStatus}
                  onToggle={onToggle}
                />
              </div>
            )}
            {dayTemplate.activeRecovery && (
              <div className="mt-1 px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20">
                <div className="text-[10px] text-blue-400 font-medium">Active Recovery</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function Schedule({ tier, startDate, sessionStatus, onSessionToggle }) {
  const [weekOffset, setWeekOffset] = useState(0)
  const scrollRef = useRef(null)

  const baseDate = new Date()
  baseDate.setDate(baseDate.getDate() + weekOffset * 7)
  const weekDates = getWeekDates(baseDate)

  const programWeek = getProgramWeek(startDate, weekDates[0]) ?? 1
  const clampedWeek = Math.max(1, Math.min(8, programWeek))
  const template = WEEKLY_TEMPLATES[tier] || WEEKLY_TEMPLATES[1]

  // Scroll to today on mount
  useEffect(() => {
    if (scrollRef.current && weekOffset === 0) {
      const today = todayISO()
      const todayIdx = weekDates.findIndex((d) => toISODate(d) === today)
      if (todayIdx >= 0 && scrollRef.current.children[todayIdx]) {
        scrollRef.current.children[todayIdx].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        })
      }
    }
  }, [weekOffset])

  function handleToggle(slotKey, action) {
    onSessionToggle(slotKey, action)
  }

  // Completion stats
  const doneCount = weekDates.reduce((acc, date) => {
    const iso = toISODate(date)
    const tmpl = template[weekDates.indexOf(date)]
    if (tmpl.am && sessionStatus[`${iso}_am`] === 'done') acc++
    if (tmpl.pm && sessionStatus[`${iso}_pm`] === 'done') acc++
    return acc
  }, 0)

  const totalSessions = template.reduce((acc, d) => {
    if (d.am) acc++
    if (d.pm) acc++
    return acc
  }, 0)

  const progressPct = totalSessions > 0 ? Math.round((doneCount / totalSessions) * 100) : 0

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-5 pb-3">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h1 className="text-xl font-black text-white">Schedule</h1>
            {startDate && (
              <p className="text-xs text-orange-400 font-semibold">
                Week {clampedWeek} of 8 · {TIER_LABELS[tier]}
              </p>
            )}
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-orange-500">{progressPct}%</div>
            <div className="text-[10px] text-gray-500">{doneCount}/{totalSessions} done</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-gray-800 rounded-full mt-2 mb-3">
          <div
            className="h-full bg-orange-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Week navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setWeekOffset((w) => w - 1)}
            className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="text-sm font-semibold text-gray-300">
            {shortMonthDay(weekDates[0])} – {shortMonthDay(weekDates[6])}
            {weekOffset === 0 && <span className="ml-2 text-orange-500 text-xs">This Week</span>}
          </div>
          <button
            onClick={() => setWeekOffset((w) => w + 1)}
            className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Scrollable day cards */}
      <div
        ref={scrollRef}
        className="flex gap-3 px-4 pb-6 overflow-x-auto scrollbar-hide flex-1"
        style={{ alignContent: 'flex-start' }}
      >
        {weekDates.map((date, idx) => (
          <DayCard
            key={toISODate(date)}
            dayTemplate={template[idx]}
            date={date}
            weekNum={clampedWeek}
            tier={tier}
            sessionStatus={sessionStatus}
            onToggle={handleToggle}
          />
        ))}
      </div>

      {!startDate && (
        <div className="mx-4 mb-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-xl">
          <p className="text-sm text-orange-300">
            Set your program start date in Settings to see week numbers.
          </p>
        </div>
      )}
    </div>
  )
}
