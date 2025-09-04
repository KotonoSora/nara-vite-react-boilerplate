import type { VirtualCalendarProps } from "../types/type";

import { InfiniteScroll } from "./infinite-scroll-with-hook";
import { WeekRow } from "./week-row";

export function VirtualCalendar({ renderDay }: VirtualCalendarProps) {
  return (
    <InfiniteScroll>
      {(weekIndex) => <WeekRow weekIndex={weekIndex} renderDay={renderDay} />}
    </InfiniteScroll>
  );
}
