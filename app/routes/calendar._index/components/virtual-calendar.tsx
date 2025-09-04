import { useCallback } from "react";

import type { VirtualCalendarProps } from "../types/type";

import { InfiniteScroll } from "./infinite-scroll-with-hook";
import { WeekRow } from "./week-row";

export function VirtualCalendar({
  renderDay,
  onRegisterActions,
}: VirtualCalendarProps) {
  const renderWeek = useCallback(
    (weekIndex: number) => (
      <WeekRow weekIndex={weekIndex} renderDay={renderDay} />
    ),
    [renderDay],
  );

  return (
    <InfiniteScroll onRegisterActions={onRegisterActions}>
      {renderWeek}
    </InfiniteScroll>
  );
}
