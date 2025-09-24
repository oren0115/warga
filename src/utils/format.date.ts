// src/utils/formatDate.ts
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export function formatDate(dateString?: string, format = "DD MMMM YYYY HH:mm") {
  if (!dateString) return "-";
  return dayjs(dateString).tz("Asia/Jakarta").format(format);
}
