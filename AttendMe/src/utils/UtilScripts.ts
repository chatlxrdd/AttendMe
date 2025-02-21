export const decodeJwt = (token: string): any => {
  const payload = token.split(".")[1];
  const decodedPayload = atob(payload);
  return JSON.parse(decodedPayload);
};

export const formatDate = (dateString: string | null) => {
  if (!dateString) return "Brak daty";
  const date = new Date(dateString);
  return date.toLocaleDateString("pl-PL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).replace(/\//g, '.');
}

export const formatTime = (dateString: string | null) => {
  if (!dateString) return "--:--";
  const date = new Date(dateString);
  return date.toLocaleTimeString("pl-PL", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
}