import {
  AlertCircle,
  Calendar,
  Edit,
  Globe,
  Lock,
  LogIn,
  Save,
  Trash2,
  UserPlus,
} from "lucide-react";

import type { ActivityConfig, ActivityType } from "./types";

/**
 * アクティビティタイプごとの設定
 */
export const ACTIVITY_CONFIG: Record<ActivityType, ActivityConfig> = {
  article_published: { icon: Globe, color: "bg-blue-100 text-blue-600" },
  article_updated: { icon: Edit, color: "bg-amber-100 text-amber-600" },
  article_deleted: { icon: Trash2, color: "bg-red-100 text-red-600" },
  draft_saved: { icon: Save, color: "bg-purple-100 text-purple-600" },
  scheduled_article: { icon: Calendar, color: "bg-green-100 text-green-600" },
  article_private: { icon: Lock, color: "bg-gray-100 text-gray-600" },
  user_login: { icon: LogIn, color: "bg-indigo-100 text-indigo-600" },
  user_registered: { icon: UserPlus, color: "bg-cyan-100 text-cyan-600" },
  scheduled_post_published: { icon: Globe, color: "bg-blue-100 text-blue-600" },
  failed: { icon: AlertCircle, color: "bg-red-100 text-red-600" },
} as const;

/**
 * デフォルトのアクティビティ表示数
 */
export const DEFAULT_ACTIVITY_LIMIT = 5;
