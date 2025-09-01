import { CalendarProvider } from "../context/calendar-provider";
import { usePageContext } from "../context/page-context";
import { VirtualCalendar } from "./virtual-calendar";
import { WeekdayHeader } from "./weekday-header";

export function CalendarApp() {
  const { weeksPerScreen, mode } = usePageContext();

  return (
    <>
      <WeekdayHeader />
      <CalendarProvider
        key={`calendar-mode-${mode}-weeksPerScreen-${weeksPerScreen}`}
      >
        <VirtualCalendar />
      </CalendarProvider>
    </>
  );
}
