import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import { usePageContext } from "../context/page-context";

export function ModeSelect() {
  const { mode, setMode } = usePageContext();

  return (
    <div>
      <Select value={`${mode}`} onValueChange={(v) => setMode(v as any)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Mode" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="date">date</SelectItem>
          <SelectItem value="sequence">sequence</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
