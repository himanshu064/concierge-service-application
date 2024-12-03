import ENV from "@/env";

const { ADMIN_ACCOUNTS } = ENV;

export const capitalizeWords = (text?: string) => {
  if (!text) return "";
  return text?.charAt(0)?.toUpperCase() + text?.slice(1);
};

export const isUserAdmin = (user?: { email?: string }): boolean => {
  return !!user?.email && ADMIN_ACCOUNTS.includes(user.email);
};
