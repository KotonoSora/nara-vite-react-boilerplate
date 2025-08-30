import { InfiniteScroll } from "./infinite-scroll";
import { WeekRow } from "./week-row";

export function VirtualCalendar() {
  return (
    <InfiniteScroll>
      {(weekIndex) => <WeekRow weekIndex={weekIndex} />}
    </InfiniteScroll>
  );
}
