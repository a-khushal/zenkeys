import { create } from 'zustand';
import { TimerDuration, TimerOption } from '../utils/time';

type TimeStore = {
    activeOption: TimerOption;
    activeDuration: TimerDuration;
    setActiveOption: (option: TimerOption) => void;
    setActiveDuration: (duration: TimerDuration) => void;
};

export const useTimeStore = create<TimeStore>((set) => ({
    activeOption: 'time',
    activeDuration: 15,
    setActiveOption: (option) => set({ activeOption: option }),
    setActiveDuration: (duration) => set({ activeDuration: duration }),
}));