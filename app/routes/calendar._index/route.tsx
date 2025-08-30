import { useState } from "react";

import type { Route } from "./+types/route";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import { DemoApp } from "./components/demo-app";
import styleUrl from "./style/custom.css?url";

export function links() {
  return [{ rel: "stylesheet", href: styleUrl }];
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Calendar Infinity" },
    { name: "description", content: "Demo calendar app" },
  ];
}

export default function Page({}: Route.ComponentProps) {
  const [weeksPerScreen, setWeeksPerScreen] = useState(2);
  return (
    <div className="h-screen flex flex-col gap-2 p-4">
      <div>
        <h1 className="text-2xl font-bold">Calendar Infinity</h1>
        <p className="text-sm text-muted-foreground">
          A demo calendar app using infinite scrolling.
        </p>
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

      <DemoApp weeksPerScreen={weeksPerScreen} overScan={1} />
    </div>
  );
}
