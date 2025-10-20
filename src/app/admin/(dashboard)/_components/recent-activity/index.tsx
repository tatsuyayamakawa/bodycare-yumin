import { Clock } from "lucide-react";

import { ACTIVITY_CONFIG, DEFAULT_ACTIVITY_LIMIT } from "./constants";
import type { ActivityType, RecentActivityProps } from "./types";

import { getRecentActivityLogs } from "@/lib/actions/activity-log";
import { formatJSTTimeAgo } from "@/lib/utils/date";

export async function RecentActivity({
  activities: initialActivities,
}: RecentActivityProps = {}) {
  let activities = initialActivities;

  if (!activities) {
    const result = await getRecentActivityLogs(DEFAULT_ACTIVITY_LIMIT);
    activities = result.success ? result.data || [] : [];
  }

  if (activities.length === 0) {
    return (
      <div className="py-4 text-center">
        <p className="text-sm text-gray-500">最近の活動はありません</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {activities.map((activity) => {
        const config =
          ACTIVITY_CONFIG[activity.action_type as ActivityType] || {
            icon: Clock,
            color: "bg-gray-100 text-gray-600",
          };

        const Icon = config.icon;

        return (
          <li
            key={activity.id}
            className="flex items-center gap-2 text-xs sm:text-sm"
          >
            <div
              className={`rounded-full p-1.5 ${config.color}`}
              aria-hidden="true"
            >
              <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-gray-900">
                {activity.description}
              </p>
              <p className="text-gray-500">
                <time dateTime={activity.created_at}>
                  {formatJSTTimeAgo(activity.created_at)}
                </time>
                {" - "}
                {activity.user_name}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
