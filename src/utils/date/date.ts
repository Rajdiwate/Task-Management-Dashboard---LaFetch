export function formatDate(isoDateString: string) {
  const date = new Date(isoDateString);

  return date.toLocaleDateString('en-GB'); // en-GB uses dd/mm/yyyy format
}

export const hhmmssToAMPm = (time: string) => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12; // Convert 0 to 12 for 12 AM
  return `${hour12}:${minutes} ${ampm}`;
};
