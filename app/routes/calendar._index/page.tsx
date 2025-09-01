import { CalendarApp } from "./components/calendar-app";
import { Controls } from "./components/controls";
import { PageHeader } from "./components/page-header";
import { PageProvider } from "./context/page-provider";

export function ContentCalendarInfinityPage() {
  return (
    <PageProvider>
      <div className="h-screen min-h-0 flex flex-col gap-2 p-4">
        <PageHeader />
        <Controls />
        <CalendarApp />
      </div>
    </PageProvider>
  );
}
