"use client";

import { WEEKDAY_NAMES } from "../constants/common";

export function WeekdayHeader() {
  return (
    <div className="grid grid-cols-7 gap-2" aria-label="calendar-weekdays">
      {WEEKDAY_NAMES.map((name) => (
        <div key={name} className="text-center" role="columnheader">
          {name}
        </div>
      ))}
    </div>
  );
}
