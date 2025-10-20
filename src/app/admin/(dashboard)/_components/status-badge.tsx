import { CheckCircle, LogIn, LogOut, XCircle } from "lucide-react";
import { type ReactNode } from "react";

type BadgeVariant = "success" | "error" | "info" | "warning";

interface StatusBadgeProps {
  variant: BadgeVariant;
  icon?: ReactNode;
  children: ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-green-100 text-green-800",
  error: "bg-red-100 text-red-800",
  info: "bg-blue-100 text-blue-800",
  warning: "bg-yellow-100 text-yellow-800",
};

/**
 * 汎用ステータスバッジコンポーネント
 */
export function StatusBadge({ variant, icon, children }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantStyles[variant]}`}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </span>
  );
}

// Audit Logs用
export function ResultBadge({ success }: { success: boolean }) {
  return (
    <StatusBadge variant={success ? "success" : "error"}>
      {success ? (
        <>
          <CheckCircle className="h-3 w-3" />
          <span className="ml-1">成功</span>
        </>
      ) : (
        <>
          <XCircle className="h-3 w-3" />
          <span className="ml-1">失敗</span>
        </>
      )}
    </StatusBadge>
  );
}

// Login Logs用
const ACTION_CONFIG = {
  login: { icon: LogIn, label: "ログイン", variant: "success" as const },
  logout: { icon: LogOut, label: "ログアウト", variant: "info" as const },
  login_failed: { icon: XCircle, label: "ログイン失敗", variant: "error" as const },
};

export function ActionBadge({ action }: { action: string }) {
  const config = ACTION_CONFIG[action as keyof typeof ACTION_CONFIG] || {
    icon: LogIn,
    label: action,
    variant: "info" as const,
  };
  const Icon = config.icon;

  return (
    <StatusBadge variant={config.variant}>
      <Icon className="h-4 w-4" />
      <span className="ml-1">{config.label}</span>
    </StatusBadge>
  );
}
