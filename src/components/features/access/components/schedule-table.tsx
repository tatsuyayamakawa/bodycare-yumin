import { scheduleData } from "../constants";

import { cn } from "@/lib/utils";

export default function ScheduleTable() {
  const { title, weekdays, schedules } = scheduleData;
  const cellBaseStyle = "border-neutral-300 py-[var(--spacing-xs)] text-center";

  return (
    <div className="w-full overflow-hidden rounded-lg border border-neutral-200 bg-white">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th
              className={cn(
                cellBaseStyle,
                "bg-brand-primary w-36 text-sm text-white",
              )}
            >
              {title}
            </th>
            {weekdays.map((day) => (
              <th
                key={day}
                className={cn(
                  cellBaseStyle,
                  "bg-brand-primary w-12 text-sm text-white",
                )}
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {schedules.map((schedule, scheduleIndex) => (
            <tr
              key={`schedule-${scheduleIndex}`}
              className={cn(
                scheduleIndex === 0 && "border-b-1 border-neutral-200",
              )}
            >
              <td className={cn(cellBaseStyle, "text-sm md:text-base")}>
                {schedule.time}
              </td>
              {schedule.days.map((available, dayIdx) => (
                <td key={dayIdx} className={cellBaseStyle}>
                  {available ? (
                    <span
                      className="inline-block h-3 w-3 rounded-full bg-neutral-600"
                      aria-label="営業中"
                    />
                  ) : (
                    <span className="text-neutral-400">-</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
