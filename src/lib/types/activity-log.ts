type MetadataValue = string | number | boolean | null | undefined;

export interface ActivityLog {
  id: string;
  action_type: ActivityType;
  description: string;
  user_id: string;
  user_name: string;
  metadata?: Record<string, MetadataValue>;
  created_at: string;
}

export type ActivityType = 
  | 'article_created'
  | 'article_published'
  | 'article_unpublished'
  | 'article_updated'
  | 'article_deleted'
  | 'draft_saved'
  | 'user_login'
  | 'user_registered'
  | 'scheduled_post_published';

export interface ActivityLogCreate {
  action_type: ActivityType;
  description: string;
  user_id: string;
  user_name: string;
  metadata?: Record<string, MetadataValue>;
}

// アクティビティタイプごとのアイコンとカラー設定
export const ACTIVITY_CONFIG = {
  article_created: {
    icon: 'Edit',
    color: 'green',
    label: '記事作成'
  },
  article_published: {
    icon: 'Eye',
    color: 'blue',
    label: '記事公開'
  },
  article_unpublished: {
    icon: 'EyeOff',
    color: 'gray',
    label: '記事非公開'
  },
  article_updated: {
    icon: 'Edit',
    color: 'orange',
    label: '記事更新'
  },
  article_deleted: {
    icon: 'Trash2',
    color: 'red',
    label: '記事削除'
  },
  draft_saved: {
    icon: 'Save',
    color: 'purple',
    label: '下書き保存'
  },
  user_login: {
    icon: 'LogIn',
    color: 'indigo',
    label: 'ログイン'
  },
  user_registered: {
    icon: 'UserPlus',
    color: 'cyan',
    label: 'ユーザー登録'
  },
  scheduled_post_published: {
    icon: 'Clock',
    color: 'amber',
    label: '予約投稿実行'
  }
} as const;