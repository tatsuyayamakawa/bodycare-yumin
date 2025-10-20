import { CheckCircle, Clock, Pencil, Shield, XCircle } from "lucide-react";

import { InvitationStatus, getRoleBadgeColor, getRoleLabel } from "../_lib";

/**
 * ロールバッジ
 */
export function RoleBadge({ role }: { role: string }) {
  const IconComponent = role === "admin" ? Shield : Pencil;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getRoleBadgeColor(role)}`}
    >
      <IconComponent className="mr-1 h-3 w-3" />
      {getRoleLabel(role)}
    </span>
  );
}

/**
 * ユーザーステータスバッジ
 */
export function UserStatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
      }`}
    >
      {isActive ? (
        <>
          <CheckCircle className="mr-1 h-3 w-3" />
          アクティブ
        </>
      ) : (
        <>
          <XCircle className="mr-1 h-3 w-3" />
          無効
        </>
      )}
    </span>
  );
}

/**
 * 招待ステータスバッジ
 */
export function InvitationStatusBadge({
  status,
}: {
  status: InvitationStatus;
}) {
  if (status.isUsed) {
    return (
      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
        <CheckCircle className="mr-1 h-3 w-3" />
        登録済み
      </span>
    );
  }

  if (status.isExpired) {
    return (
      <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
        <XCircle className="mr-1 h-3 w-3" />
        期限切れ
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
      <Clock className="mr-1 h-3 w-3" />
      待機中
    </span>
  );
}
