export function minutesToHoursAndMinutesString(totalMinutes: number) {
  const absoluteMinutes = Math.floor(totalMinutes % 1440);
  const hours = Math.floor(absoluteMinutes / 60);
  const mins = absoluteMinutes % 60;

  const formattedHours = String(hours).padStart(2, "0");
  const formattedMins = String(mins).padStart(2, "0");

  return `${formattedHours}:${formattedMins}`;
}
