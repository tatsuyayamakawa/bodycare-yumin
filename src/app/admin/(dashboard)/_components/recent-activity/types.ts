import type { LucideIcon } from "lucide-react";

import type { ActivityLog } from "@/lib/types/activity-log";

export interface RecentActivityProps {
  activities?: ActivityLog[];
}

export type ActivityType =
  | "article_published"
  | "article_updated"
  | "article_deleted"
  | "draft_saved"
  | "scheduled_article"
  | "article_private"
  | "user_login"
  | "user_registered"
  | "scheduled_post_published"
  | "failed";

export interface ActivityConfig {
  icon: LucideIcon;
  color: string;
}
