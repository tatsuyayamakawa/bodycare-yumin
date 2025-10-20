import { Pencil, Shield } from "lucide-react";

export const getRoleLabel = (role?: string) => {
  return role === "admin" ? "管理者" : "編集者";
};

export const getRoleBadgeColor = (role?: string) => {
  return role === "admin"
    ? "border-red-200 bg-red-50 text-red-800"
    : "border-blue-200 bg-blue-50 text-blue-800";
};

export const getRoleTextColor = (role?: string) => {
  return role === "admin" ? "text-red-800" : "text-blue-800";
};

export const getRoleIcon = (role?: string) => {
  return role === "admin" ? Shield : Pencil;
};