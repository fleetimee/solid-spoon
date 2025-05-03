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

export function formatDateRangeHumanized(
  startDateInput: Date | string,
  endDateInput: Date | string
): string {
  const timeZone = "Asia/Jakarta";

  const formatDatePart = (dateInput: Date | string): string => {
    const date =
      typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    // Ensure the date is treated correctly regardless of local timezone before formatting
    // This might require more robust parsing if strings aren't ISO standard with timezone info

    const dateOptions: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: timeZone,
    };
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // Use 24-hour format
      timeZone: timeZone,
    };

    const formattedDate = date.toLocaleDateString("en-GB", dateOptions); // Use 'en-GB' for DD Month YYYY potentially
    // Replace default ':' with '.' for the time part
    const formattedTime = date
      .toLocaleTimeString("en-GB", timeOptions)
      .replace(":", ".");

    return `${formattedDate} ${formattedTime}`;
  };

  const formattedStartDate = formatDatePart(startDateInput);
  const formattedEndDate = formatDatePart(endDateInput);

  return `${formattedStartDate} - ${formattedEndDate}`;
}
