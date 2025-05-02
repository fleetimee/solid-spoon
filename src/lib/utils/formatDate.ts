// /lib/utils/formatDate.ts

import { parse } from "date-fns";
import { toZonedTime, format } from "date-fns-tz";

const TIME_ZONE = "Asia/Jakarta";
const INPUT_PATTERN = "yyyy-MM-dd HH:mm:ss.SSSSSS";

export function formatDateToJakarta(dateInput: Date | string | number): string {
  let d: Date;

  if (dateInput instanceof Date) {
    d = dateInput;
  } else if (typeof dateInput === "string") {
    // DB timestamp → treat as UTC
    const asIso = dateInput.includes(" ")
      ? `${dateInput.replace(" ", "T")}Z`
      : dateInput;
    d = parse(asIso, INPUT_PATTERN, new Date());
  } else {
    d = new Date(dateInput);
  }

  const zoned = toZonedTime(d, TIME_ZONE);
  return format(zoned, "dd/MM/yyyy HH:mm", { timeZone: TIME_ZONE });
}
