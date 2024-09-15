"use client";
import React, { useState } from "react";
import { format, addDays, parseISO, toDate } from "date-fns";
import Link from "next/link";

interface DateNavProps {
  todayDate: string;
}

export default function DateNav({ todayDate }: DateNavProps) {
  // Parse todayDate (e.g., "2024-09-14") into a Date object
  const parsedTodayDate = toDate(parseISO(todayDate));

  // Function to format the date in the desired string format
  const formatDate = (date: any, isToday = false) => {
    const formattedDate = format(date, "MMM d");
    const urlDate = format(date, "yyyy-MM-dd");
    return {
      date: formattedDate,
      urlDate,
      isToday,
    };
  };

  // Function to generate 3 days before and 3 days after the selected date
  const generateDates = (selectedDate: any) => {
    const dates = [];
    // Generate dates for 3 days before and 3 days after
    for (let i = -3; i <= 3; i++) {
      const date = addDays(selectedDate, i);
      dates.push(formatDate(date, i === 0)); // Mark the current date as `isToday`
    }
    return dates;
  };

  // State to keep track of the start date
  const [startDate, setStartDate] = useState(parsedTodayDate);

  // Event handler for navigating to the previous 7 days
  const handlePrevClick = () => {
    const newStartDate = addDays(startDate, -7);
    setStartDate(newStartDate);
  };

  // Event handler for navigating to the next 7 days
  const handleNextClick = () => {
    const newStartDate = addDays(startDate, 7);
    setStartDate(newStartDate);
  };

  // Render the dates
  const renderDates = () => {
    const dates = generateDates(startDate);
    return dates.map((item, index) => (
      <Link
        key={index}
        href={`/wnba/matchup/${item.urlDate}`}
        className="text-center"
        style={{ transitionDelay: `${index * 100}ms` }}
      >
        <span className="hidden md:block">
          <div
            className={`text-sm uppercase ${item.isToday ? "font-bold" : ""}`}
          >
            {item.date}
          </div>
        </span>

        <span className="md:hidden">
          <div
            className={`text-sm uppercase ${item.isToday ? "font-bold" : ""}`}
          >
            {item.date}
          </div>
        </span>
      </Link>
    ));
  };

  return (
    <div className="flex justify-between items-center text-gray-900 mb-4 md:my-4 lg:my-4">
      <a
        href="#"
        className="relative inline-flex items-center"
        onClick={handlePrevClick}
      >
        <span className="sr-only">Previous</span>
        <svg
          className="h-7 w-7"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
            clipRule="evenodd"
          />
        </svg>
      </a>
      {renderDates()}
      <a
        href="#"
        className="relative inline-flex items-center"
        onClick={handleNextClick}
      >
        <span className="sr-only">Next</span>
        <svg
          className="h-7 w-7"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
            clipRule="evenodd"
          />
        </svg>
      </a>
    </div>
  );
}
