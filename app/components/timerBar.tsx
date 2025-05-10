"use client"

import { useRecoilState } from "recoil"
import { Clock, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTimeStore } from "../store/time"
import { TimerDuration } from "../utils/time"

export default function TimerBar() {
    const activeOption = useTimeStore((state) => state.activeOption);
    const activeDuration = useTimeStore((state) => state.activeDuration);
    const setActiveOption = useTimeStore((state) => state.setActiveOption);
    const setActiveDuration = useTimeStore((state) => state.setActiveDuration);

    const options = [
        { id: "time" as const, icon: <Clock className="h-3.5 w-3.5 mr-1" />, label: "time" },
    ]

    const durations: TimerDuration[] = [15, 30, 60];

    return (
        <div className="flex items-center justify-between w-full max-w-3xl px-4 py-2 rounded-md bg-zinc-900 text-zinc-400 shadow-md">
            <div className="flex items-center space-x-4">
                {options.map((option) => (
                    <button
                        key={option.id}
                        className={cn(
                            "flex items-center text-xs font-medium px-2 py-1 rounded transition-all hover:cursor-pointer duration-200 hover:text-zinc-100",
                            activeOption === option.id ? "text-teal-400" : "text-zinc-400",
                        )}
                        onClick={() => setActiveOption(option.id)}
                    >
                        {option.icon}
                        {option.label}
                    </button>
                ))}
            </div>

            <div className="flex items-center space-x-3">
                {durations.map((duration) => (
                    <button
                        key={duration}
                        className={cn(
                            "text-xs font-medium px-2 py-1 rounded transition-all hover:cursor-pointer  duration-200 hover:text-zinc-100 hover:bg-zinc-800",
                            activeDuration === duration ? "text-teal-400" : "text-zinc-400",
                        )}
                        onClick={() => setActiveDuration(duration)}
                    >
                        {duration}
                    </button>
                ))}
            </div>
        </div>
    )
}
