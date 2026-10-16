export const getTimePast = (iso: string) => {
  const diffMs = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));


  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  return `${days}d ago`;
};

export const getTime = (iso: string) => {
  const date = new Date(iso)
  return date.toLocaleString([], {hour: "2-digit", minute: "2-digit"})
};


