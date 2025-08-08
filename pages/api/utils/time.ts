// pages/api/utils/time.ts
export const now = () => new Date();
export const addHours = (date: Date, h: number) => new Date(date.getTime() + h * 60 * 60 * 1000);
export const isExpired = (date: Date) => new Date() > date;
