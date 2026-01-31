export const roles = ["owner", "vet", "admin"] as const;

export type UserRole = (typeof roles)[number];
