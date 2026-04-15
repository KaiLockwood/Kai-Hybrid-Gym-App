// ─── Run Duration Data ───────────────────────────────────────────────────────

export const RUN_DURATIONS = {
  1: [
    { week: 1, run1: '3mi', run2: '5mi', run3: null, long: '8mi' },
    { week: 2, run1: '3mi', run2: '5mi', run3: null, long: '7mi' },
    { week: 3, run1: '4mi', run2: '6mi', run3: null, long: '9mi' },
    { week: 4, run1: '3mi', run2: '6mi', run3: null, long: '10mi' },
    { week: 5, run1: '3mi', run2: '7mi', run3: null, long: '8mi' },
    { week: 6, run1: '4mi', run2: '7mi', run3: null, long: '9mi' },
    { week: 7, run1: '4mi', run2: '8mi', run3: null, long: '11mi' },
    { week: 8, run1: '5mi', run2: '8mi', run3: null, long: '12mi' },
  ],
  2: [
    { week: 1, run1: '4mi', run2: '6mi', run3: 'Quality', long: '8mi' },
    { week: 2, run1: '4mi', run2: '6mi', run3: 'Quality', long: '8mi' },
    { week: 3, run1: '5mi', run2: '7mi', run3: 'Quality', long: '9mi' },
    { week: 4, run1: '4mi', run2: '6mi', run3: 'Quality', long: '10mi' },
    { week: 5, run1: '5mi', run2: '7mi', run3: 'Quality', long: '11mi' },
    { week: 6, run1: '5mi', run2: '7mi', run3: 'Quality', long: '12mi' },
    { week: 7, run1: '5mi', run2: '8mi', run3: 'Quality', long: '12mi' },
    { week: 8, run1: '5mi', run2: '8mi', run3: 'Quality', long: '13mi' },
  ],
  3: [
    { week: 1, run1: '4mi', run2: '6mi', run3: '30–40min', long: '8mi' },
    { week: 2, run1: '5mi', run2: '6mi', run3: '36–48min', long: '8mi' },
    { week: 3, run1: '5mi', run2: '7mi', run3: '40–48min', long: '9mi' },
    { week: 4, run1: '5mi', run2: '7mi', run3: '40–50min', long: '10mi' },
    { week: 5, run1: '5mi', run2: '8mi', run3: '48–56min', long: '10mi' },
    { week: 6, run1: '5mi', run2: '8mi', run3: '48–56min', long: '11mi' },
    { week: 7, run1: '5mi', run2: '9mi', run3: '56–60min', long: '12mi' },
    { week: 8, run1: '5mi', run2: '9mi', run3: '60+min',   long: '13mi' },
  ],
}

// ─── Weekly Templates ─────────────────────────────────────────────────────────

// Each day: { am: null | { type, label }, pm: null | { type, label }, rest: bool, activeRecovery: bool }
// type: 'run' | 'gym'
// runKey: 'run1' | 'run2' | 'run3' | 'long'  (maps into RUN_DURATIONS)
// gymLabel: 'Full' | 'Push' | 'Legs' | 'Arms' | 'Shoulders & Chest'

export const WEEKLY_TEMPLATES = {
  1: [
    // Monday
    {
      dayName: 'Mon',
      am: { type: 'run', runKey: 'run1', label: 'Easy Run' },
      pm: null,
    },
    // Tuesday
    {
      dayName: 'Tue',
      am: null,
      pm: { type: 'gym', gymLabel: 'Full', subtype: 'full' },
    },
    // Wednesday
    {
      dayName: 'Wed',
      am: { type: 'run', runKey: 'run2', label: 'Easy/Stride Run' },
      pm: { type: 'gym', gymLabel: 'Push', subtype: 'push' },
    },
    // Thursday
    {
      dayName: 'Thu',
      am: null,
      pm: { type: 'gym', gymLabel: 'Legs', subtype: 'legs' },
    },
    // Friday
    {
      dayName: 'Fri',
      am: null,
      pm: { type: 'gym', gymLabel: 'Arms', subtype: 'arms' },
    },
    // Saturday
    {
      dayName: 'Sat',
      am: { type: 'run', runKey: 'long', label: 'Long Run' },
      pm: null,
    },
    // Sunday
    {
      dayName: 'Sun',
      am: null,
      pm: { type: 'gym', gymLabel: 'Shoulders & Chest', subtype: 'shoulders_chest' },
      activeRecovery: true,
    },
  ],
  2: [
    // Monday
    {
      dayName: 'Mon',
      am: { type: 'run', runKey: 'run1', label: 'Easy Run' },
      pm: { type: 'gym', gymLabel: 'Full', subtype: 'full' },
    },
    // Tuesday
    {
      dayName: 'Tue',
      am: { type: 'run', runKey: 'run2', label: 'Easy Run' },
      pm: { type: 'gym', gymLabel: 'Push', subtype: 'push' },
    },
    // Wednesday
    {
      dayName: 'Wed',
      am: null,
      pm: { type: 'gym', gymLabel: 'Legs', subtype: 'legs' },
    },
    // Thursday
    {
      dayName: 'Thu',
      am: { type: 'run', runKey: 'run3', label: 'Quality Run' },
      pm: null,
    },
    // Friday
    {
      dayName: 'Fri',
      am: null,
      pm: { type: 'gym', gymLabel: 'Arms', subtype: 'arms' },
    },
    // Saturday
    {
      dayName: 'Sat',
      am: { type: 'run', runKey: 'long', label: 'Long Run' },
      pm: null,
    },
    // Sunday
    {
      dayName: 'Sun',
      am: null,
      pm: { type: 'gym', gymLabel: 'Shoulders & Chest', subtype: 'shoulders_chest' },
      activeRecovery: true,
    },
  ],
  3: [
    // Monday
    {
      dayName: 'Mon',
      am: { type: 'run', runKey: 'run1', label: 'Easy Run' },
      pm: { type: 'gym', gymLabel: 'Full', subtype: 'full' },
    },
    // Tuesday
    {
      dayName: 'Tue',
      am: { type: 'run', runKey: 'run2', label: 'Easy Run' },
      pm: { type: 'gym', gymLabel: 'Push', subtype: 'push' },
    },
    // Wednesday
    {
      dayName: 'Wed',
      am: null,
      pm: { type: 'gym', gymLabel: 'Legs', subtype: 'legs' },
    },
    // Thursday
    {
      dayName: 'Thu',
      am: { type: 'run', runKey: 'run3', label: 'Quality Run' },
      pm: null,
    },
    // Friday
    {
      dayName: 'Fri',
      am: null,
      pm: { type: 'gym', gymLabel: 'Arms', subtype: 'arms' },
    },
    // Saturday
    {
      dayName: 'Sat',
      am: { type: 'run', runKey: 'long', label: 'Long Run' },
      pm: null,
    },
    // Sunday
    {
      dayName: 'Sun',
      am: { type: 'run', runKey: 'run3', label: 'Race Circuits' },
      pm: { type: 'gym', gymLabel: 'Shoulders & Chest', subtype: 'shoulders_chest' },
    },
  ],
}

// ─── Exercise Library ─────────────────────────────────────────────────────────

export const EXERCISE_LIBRARY = {
  full: {
    label: 'Full Workout',
    subtype: 'full',
    exercises: [
      'Pull-Ups (or Lat Pulldown)',
      'Barbell Rows',
      'Bench Press',
      'Overhead Press',
      'Squats',
      'Romanian Deadlift',
      'Dumbbell Lateral Raise',
      'Face Pulls',
    ],
  },
  push: {
    label: 'Push Workout',
    subtype: 'push',
    exercises: [
      'Bench Press',
      'Incline Dumbbell Press',
      'Overhead Press',
      'Cable Lateral Raise',
      'Tricep Pushdown',
      'Overhead Tricep Extension',
    ],
  },
  legs: {
    label: 'Legs Workout',
    subtype: 'legs',
    exercises: [
      'Squats',
      'Romanian Deadlift',
      'Leg Press',
      'Leg Curl',
      'Calf Raises',
      'Walking Lunges',
    ],
  },
  arms: {
    label: 'Arms Workout',
    subtype: 'arms',
    exercises: [
      'Barbell Curl',
      'Hammer Curl',
      'Incline Dumbbell Curl',
      'Tricep Pushdown',
      'Skull Crushers',
      'Cable Curl',
    ],
  },
  shoulders_chest: {
    label: 'Shoulders & Chest',
    subtype: 'shoulders_chest',
    exercises: [
      'Overhead Press',
      'Dumbbell Lateral Raise',
      'Face Pulls',
      'Reverse Fly',
      'Bench Press',
      'Cable Fly',
    ],
  },
}

export const GYM_SUBTYPES = Object.keys(EXERCISE_LIBRARY)

export const TIER_LABELS = {
  1: 'Tier 1 — Entry',
  2: 'Tier 2 — Advanced',
  3: 'Tier 3 — Advanced+',
}
