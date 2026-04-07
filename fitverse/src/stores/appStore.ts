import { create } from 'zustand';

export type Zone = 'orbit' | 'body' | 'mind' | 'care';

export interface Reminder {
  id: string;
  type: 'medication' | 'water' | 'appointment' | 'break' | 'stretch' | 'sleep' | 'custom';
  title: string;
  time: string;
  done: boolean;
  color: string;
}

export interface WorkoutEntry {
  id: string;
  type: 'run' | 'lift' | 'swim' | 'yoga' | 'cycle';
  date: string;
  duration: number; // minutes
  intensity: number; // 1-10
}

export interface MoodEntry {
  id: string;
  mood: number; // 1-5
  note: string;
  date: string;
}

interface AppState {
  activeZone: Zone;
  setActiveZone: (zone: Zone) => void;
  isTransitioning: boolean;
  setIsTransitioning: (v: boolean) => void;

  // Fitness
  streakDays: number;
  workouts: WorkoutEntry[];
  totalWorkouts: number;

  // Mental
  moodEntries: MoodEntry[];
  meditationMinutes: number;
  currentMood: number;

  // Care
  reminders: Reminder[];
  toggleReminder: (id: string) => void;
  addReminder: (reminder: Reminder) => void;
}

// Demo data
const demoReminders: Reminder[] = [
  { id: '1', type: 'medication', title: 'Vitamin D - 1000 IU', time: '08:00 AM', done: false, color: '#f59e0b' },
  { id: '2', type: 'water', title: 'Drink Water (Glass 1)', time: '09:00 AM', done: true, color: '#3b82f6' },
  { id: '3', type: 'medication', title: 'Omega-3 Fish Oil', time: '12:00 PM', done: false, color: '#f59e0b' },
  { id: '4', type: 'stretch', title: 'Mid-day Stretch Break', time: '02:00 PM', done: false, color: '#f97316' },
  { id: '5', type: 'water', title: 'Drink Water (Glass 4)', time: '03:00 PM', done: true, color: '#3b82f6' },
  { id: '6', type: 'medication', title: 'Evening Multivitamin', time: '07:00 PM', done: false, color: '#f59e0b' },
  { id: '7', type: 'sleep', title: 'Wind Down — No Screens', time: '10:00 PM', done: false, color: '#a855f7' },
  { id: '8', type: 'break', title: 'Take a 10-min Walk', time: '04:00 PM', done: false, color: '#22c55e' },
];

const demoWorkouts: WorkoutEntry[] = [
  { id: '1', type: 'run', date: '2026-04-07', duration: 35, intensity: 7 },
  { id: '2', type: 'lift', date: '2026-04-06', duration: 50, intensity: 8 },
  { id: '3', type: 'yoga', date: '2026-04-05', duration: 30, intensity: 4 },
  { id: '4', type: 'run', date: '2026-04-04', duration: 40, intensity: 6 },
  { id: '5', type: 'swim', date: '2026-04-03', duration: 45, intensity: 7 },
  { id: '6', type: 'lift', date: '2026-04-02', duration: 55, intensity: 9 },
  { id: '7', type: 'cycle', date: '2026-04-01', duration: 60, intensity: 6 },
];

const demoMoods: MoodEntry[] = [
  { id: '1', mood: 4, note: 'Great workout morning', date: '2026-04-07' },
  { id: '2', mood: 3, note: 'Stressful work day', date: '2026-04-06' },
  { id: '3', mood: 5, note: 'Feeling amazing after yoga', date: '2026-04-05' },
  { id: '4', mood: 3, note: 'Average day', date: '2026-04-04' },
  { id: '5', mood: 4, note: 'Good swim session', date: '2026-04-03' },
  { id: '6', mood: 2, note: 'Tired, poor sleep', date: '2026-04-02' },
  { id: '7', mood: 4, note: 'Productive day', date: '2026-04-01' },
];

export const useAppStore = create<AppState>((set) => ({
  activeZone: 'orbit',
  setActiveZone: (zone) => set({ activeZone: zone }),
  isTransitioning: false,
  setIsTransitioning: (v) => set({ isTransitioning: v }),

  streakDays: 7,
  workouts: demoWorkouts,
  totalWorkouts: 142,

  moodEntries: demoMoods,
  meditationMinutes: 320,
  currentMood: 4,

  reminders: demoReminders,
  toggleReminder: (id) =>
    set((state) => ({
      reminders: state.reminders.map((r) =>
        r.id === id ? { ...r, done: !r.done } : r
      ),
    })),
  addReminder: (reminder) =>
    set((state) => ({ reminders: [...state.reminders, reminder] })),
}));
