import { formatTime } from "./formatDate";

const getShortName = (name: string) => {
  return name.split(/[\s-]/)[0];
};

const renderStatus = (status: string, dateUtc: string) => {
  if (status === "0") {
    return <p className="font-medium">{formatTime(dateUtc)}</p>;
  } else if (status === "3") {
    return <p className="font-medium">{"Final"}</p>;
  } else {
    return (
      <>
        <div className="flex-none rounded-full bg-emerald-500/20 p-1">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </div>{" "}
        <p className="leading-5">{status}</p>
      </>
    );
  }
};

const formatStatType = (statType: string): string => {
  return statType
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatSecondsToMinutes = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  // Pad seconds with a leading zero if less than 10
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

export { getShortName, renderStatus, formatStatType, formatSecondsToMinutes };
