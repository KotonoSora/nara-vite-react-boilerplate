import type { VirtualCalendarProps } from "../types/type";

import { InfiniteScroll } from "./infinite-scroll-with-hook";
import { WeekRow } from "./week-row";

export function VirtualCalendar({
  renderDay,
  onRegisterActions,
  onVisibleLabelChange,
}: VirtualCalendarProps) {
  const renderWeek = (weekIndex: number) => (
    <WeekRow weekIndex={weekIndex} renderDay={renderDay} />
  );

  return (
    <InfiniteScroll
      onRegisterActions={onRegisterActions}
      onVisibleLabelChange={onVisibleLabelChange}
    >
      {renderWeek}
    </InfiniteScroll>
  );
}
