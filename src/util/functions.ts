import { DateTime } from "luxon";

export function getTodayUTC() {
  return DateTime.utc().toISO();
}
