import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import { usePageContext } from "../context/page-context";

export function WeeksSelect() {
  const { weeksPerScreen, setWeeksPerScreen } = usePageContext();

  return (
    <div>
      <Select
        value={`${weeksPerScreen}`}
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
  );
}
