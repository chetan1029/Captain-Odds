import { format } from "date-fns";
import { toDate } from "date-fns-tz";

const formatDateUTC = (date: Date) => {
  // Convert the local date to UTC timestamp (in milliseconds since January 1, 1970)
  const utcTimestamp = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );

  return utcTimestamp;
};

const formatDate = (date: Date, isToday: boolean) => {
  // Set up formatting options for Toronto timezone
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "America/Toronto", // Use Toronto timezone
  };

  // Format the date
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);

  return { date: formattedDate, isToday };
};

// Format JavaScript Date to a readable date string (e.g., "Monday, September 11, 2024")
const formatDateOnly = (dateString: string): string => {
  const date = new Date(dateString);

  // Define the Toronto timezone
  const timeZone = "America/Toronto";

  // Convert the date string directly to a Date object in the Toronto timezone
  const torontoDate = toDate(date, { timeZone });

  // Format the date to the desired format
  const formattedDate = format(torontoDate, "EEEE, MMMM d, yyyy");

  return formattedDate;
};

// Format JavaScript Date to a readable date and time string (e.g., "Monday, September 11, 2024, 10:30 AM")
const formatDateTime = (date: Date): string => {
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  return (
    date.toLocaleDateString("en-US", dateOptions) +
    ", " +
    date.toLocaleTimeString("en-US", timeOptions)
  );
};

// Format JavaScript Date to a readable time string (e.g., "10:30 AM")
const formatTime = (dateUtc: string): string => {
  const timestampInMs = parseInt(dateUtc, 10) * 1000;
  const date = new Date(timestampInMs);
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: "America/Toronto",
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
};

// Format JavaScript Date to a URL-friendly date string (e.g., "2024-09-11")
const formatDateUrl = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  const formattedDate = date.toLocaleDateString("en-US", options);

  // Rearrange the date parts to yyyy-mm-dd format
  const [month, day, year] = formattedDate.split("/");
  return `${year}-${month}-${day}`;
};

// Format JavaScript Date to a short month and day string (e.g., "Sep 11")
const formatDateMonthOnly = (dateUtc: string): string => {
  const timestampInMs = parseInt(dateUtc, 10) * 1000;
  const date = new Date(timestampInMs);

  // Format the date using the desired options
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    timeZone: "America/Toronto",
  };

  return new Intl.DateTimeFormat("en-US", options).format(date);
};

const formatDateTimeMonthOnly = (dateUtc: string): string => {
  const timestampInMs = parseInt(dateUtc, 10) * 1000;
  const date = new Date(timestampInMs);

  // Format the date and time using the desired options
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // For AM/PM format
    timeZone: "America/Toronto",
  };

  return new Intl.DateTimeFormat("en-US", options).format(date);
};

const getTodayDate = () => {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "America/Toronto",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  const currentDate = new Date().toLocaleDateString("en-CA", options);
  return currentDate;
};

export {
  formatDateUTC,
  formatDate,
  formatDateOnly,
  formatDateTime,
  formatTime,
  formatDateUrl,
  formatDateMonthOnly,
  formatDateTimeMonthOnly,
  getTodayDate,
};
