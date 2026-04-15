/**
 * Returns a Date object for the Monday of the ISO week containing `date`.
 */
export function getMondayOfWeek(date) {
  const d = new Date(date)
  const day = d.getDay() // 0 = Sun, 1 = Mon ...
  const diff = (day === 0 ? -6 : 1 - day)
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

/**
 * Returns an array of 7 Date objects [Mon … Sun] for the week of `date`.
 */
export function getWeekDates(date) {
  const monday = getMondayOfWeek(date)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(d.getDate() + i)
    return d
  })
}

/**
 * Formats a Date as "YYYY-MM-DD".
 */
export function toISODate(date) {
  const d = new Date(date)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/**
 * Parses "YYYY-MM-DD" → Date at midnight local time.
 */
export function parseISODate(str) {
  if (!str) return null
  const [y, m, d] = str.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/**
 * Returns the 1-based program week number given a start date (ISO string)
 * and a reference date. Returns null if start date not set.
 * Caps at 8.
 */
export function getProgramWeek(startDateStr, refDate = new Date()) {
  if (!startDateStr) return null
  const start = parseISODate(startDateStr)
  if (!start) return null
  start.setHours(0, 0, 0, 0)
  const ref = new Date(refDate)
  ref.setHours(0, 0, 0, 0)
  const diffMs = ref - start
  if (diffMs < 0) return 1
  const weekNum = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)) + 1
  return Math.min(weekNum, 8)
}

/**
 * Short weekday name from Date.
 */
export function shortDayName(date) {
  return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date)
}

/**
 * Short month + day, e.g. "Apr 15".
 */
export function shortMonthDay(date) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date)
}

/**
 * Full readable date, e.g. "Tuesday, April 15".
 */
export function fullDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

/**
 * Today's ISO date string.
 */
export function todayISO() {
  return toISODate(new Date())
}

/**
 * Returns an array of the last N Monday dates (ISO strings), most recent last.
 */
export function getLastNWeekMondays(n, refDate = new Date()) {
  const mondays = []
  const monday = getMondayOfWeek(refDate)
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(monday)
    d.setDate(d.getDate() - i * 7)
    mondays.push(toISODate(d))
  }
  return mondays
}

/**
 * Calculate current streak (consecutive days with at least one log entry).
 * Returns { current, longest }.
 */
export function calcStreaks(logs) {
  if (!logs || logs.length === 0) return { current: 0, longest: 0 }

  // Build a set of dates that have logs
  const dateset = new Set(logs.map((l) => l.date))
  const sorted = Array.from(dateset).sort()

  let longest = 0
  let current = 0
  let streak = 1

  for (let i = 1; i < sorted.length; i++) {
    const prev = parseISODate(sorted[i - 1])
    const curr = parseISODate(sorted[i])
    const diff = (curr - prev) / (24 * 60 * 60 * 1000)
    if (diff === 1) {
      streak++
    } else {
      longest = Math.max(longest, streak)
      streak = 1
    }
  }
  longest = Math.max(longest, streak)

  // Current streak: check if today or yesterday is in the set
  const today = todayISO()
  const yesterday = toISODate(new Date(Date.now() - 86400000))
  if (!dateset.has(today) && !dateset.has(yesterday)) {
    current = 0
  } else {
    // Walk back from today
    let check = today
    let s = 0
    while (dateset.has(check)) {
      s++
      const d = parseISODate(check)
      d.setDate(d.getDate() - 1)
      check = toISODate(d)
    }
    current = s
  }

  return { current, longest }
}
