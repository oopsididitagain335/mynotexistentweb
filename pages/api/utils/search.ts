// pages/api/utils/search.ts
export const fuzzySearch = (term: string, fields: string[]): boolean => {
  const t = term.toLowerCase();
  return fields.some(field => field.toLowerCase().includes(t));
};
