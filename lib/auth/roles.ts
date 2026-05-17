export type UserRole = "admin" | "editor" | "user";

export type Permission =
  | "leads:read"
  | "leads:write"
  | "leads:delete"
  | "admin:settings";

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: ["leads:read", "leads:write", "leads:delete", "admin:settings"],
  editor: ["leads:read", "leads:write"],
  user: [],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function parseRole(value: unknown): UserRole {
  if (value === "admin" || value === "editor" || value === "user") {
    return value;
  }
  return "user";
}
