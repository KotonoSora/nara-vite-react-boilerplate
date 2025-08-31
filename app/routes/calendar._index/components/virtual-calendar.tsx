import { InfiniteScroll } from "./infinite-scroll-with-hook";
import { WeekRow } from "./week-row";

export function VirtualCalendar() {
  return (
    <InfiniteScroll>
      {(weekIndex) => <WeekRow weekIndex={weekIndex} />}
    </InfiniteScroll>
  );
}
