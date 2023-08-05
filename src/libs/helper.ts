export const formatDate = (dateISO: string, separator = '/') => {
  const date = new Date(dateISO);
  return `${date.getDate()}${separator}${date.getMonth()}${separator}${date.getFullYear()}`;
};

export const formatPath = (path: string) =>
  ['~/', '~\\'].includes(path.slice(0, 2)) ? path.slice(2) : path;
