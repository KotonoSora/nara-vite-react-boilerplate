import { useState } from "react";

import type { CalendarEngineMode } from "./types/type";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import { DemoApp } from "./components/demo-app";

export function ContentCalendarInfinityPage() {
  const [weeksPerScreen, setWeeksPerScreen] = useState(2);
  const [mode, setMode] = useState<CalendarEngineMode>("sequence");

  return (
    <div className="h-screen min-h-0 flex flex-col gap-2 p-4">
      <div>
        <h1 className="text-2xl font-bold">
          Vertical Scrolling Calendar Infinity
        </h1>
        <p className="text-sm text-muted-foreground">
          A demo calendar app using infinite scrolling on vertical.
        </p>
      </div>

      <div className="flex flex-row gap-2">
        <div>
          <Select
            defaultValue={`${mode}`}
            onValueChange={(v) => setMode(v as CalendarEngineMode)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">date</SelectItem>
              <SelectItem value="sequence">sequence</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select
            defaultValue={`${weeksPerScreen}`}
            onValueChange={(v) => setWeeksPerScreen(Number(v))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Week view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="4">4</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DemoApp
        weeksPerScreen={weeksPerScreen}
        overScan={weeksPerScreen + 1}
        mode={mode}
      />
    </div>
  );
}
