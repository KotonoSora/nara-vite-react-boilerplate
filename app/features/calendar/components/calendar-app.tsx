import type { CalendarAppProps } from "../types/type";

import { CalendarProvider } from "../context/calendar-provider";
import { usePageContext } from "../context/page-context";
import { VirtualCalendar } from "./virtual-calendar";

export function CalendarApp({
  renderDay,
  onRegisterActions,
  onVisibleLabelChange,
}: CalendarAppProps) {
  const { weeksPerScreen, mode } = usePageContext();

  return (
    <CalendarProvider
      key={`calendar-mode-${mode}-weeksPerScreen-${weeksPerScreen}`}
    >
      <VirtualCalendar
        onRegisterActions={onRegisterActions}
        onVisibleLabelChange={onVisibleLabelChange}
        renderDay={renderDay}
      />
    </CalendarProvider>
  );
}
