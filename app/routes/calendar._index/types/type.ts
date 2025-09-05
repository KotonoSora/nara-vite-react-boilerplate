import type {
  Dispatch,
  MouseEventHandler,
  ReactNode,
  RefObject,
  SetStateAction,
} from "react";

export type CalendarEvent = { id: string; label: string };
export type EventsMap = Record<string, CalendarEvent[]>;

export type CalendarContextValue = {
  rowHeight: number;
  weeksPerScreen: number;
  overScan: number;
  today: Date;
  todayDayIndex: number;
  mode: CalendarEngineMode;
};

export type CalendarProviderProps = {
  children: ReactNode;
};

export type PageProviderProps = {
  children: ReactNode;
};

export type InfiniteScrollProps = {
  children: (weekIndex: number) => ReactNode;
  onRegisterActions?: RegisterActionsFn;
  onVisibleLabelChange?: (label: string) => void;
};

export type RenderDayParams = {
  day?: Date;
  dayGlobalIndex?: number;
  isToday?: boolean;
};

export type RenderDayFn = (params: RenderDayParams) => ReactNode;

export type CalendarAppProps = {
  renderDay?: RenderDayFn;
  onRegisterActions?: RegisterActionsFn;
  onVisibleLabelChange?: (label: string) => void;
};

export type VirtualCalendarProps = {
  renderDay?: RenderDayFn;
  onRegisterActions?: RegisterActionsFn;
  onVisibleLabelChange?: (label: string) => void;
};

export type DayContentProps = RenderDayParams;

export type WeekRowProps = { weekIndex: number; renderDay?: RenderDayFn };

export type DayCellProps = {
  renderDay?: RenderDayFn;
  day?: Date;
  dayGlobalIndex?: number;
};

export type CalendarActionHandle = {
  scrollToToday: () => void;
};

export type RegisterActionsFn = (h: CalendarActionHandle | null) => void;

export type WrapperWeekRowProps = {
  weekIndex: number;
  offset: number;
  children: ReactNode;
};

export type InitialScrollParams = {
  containerRef: RefObject<HTMLDivElement | null>;
  todayWeekIndex?: number;
  minWeekIndex: number;
  mode: CalendarEngineMode;
  setScrollTop: Dispatch<SetStateAction<number>>;
  onDidInitialScroll?: () => void;
  enabled?: boolean;
};

export type LazyExpansionParams = {
  scrollTop: number;
  viewportHeight: number;
  minWeekIndex: number;
  maxWeekIndex: number;
  setMinWeekIndex: Dispatch<SetStateAction<number>>;
  setMaxWeekIndex: Dispatch<SetStateAction<number>>;
  containerRef: RefObject<HTMLDivElement | null>;
  didInitialScroll: boolean;
  bufferWeeks: number;
  mode: CalendarEngineMode;
};

export type ScrollHandlerParams = {
  containerRef: RefObject<HTMLDivElement | null>;
};

export type CalendarEngineMode = "date" | "sequence";

export type VisibleWeeksLabelProps = {
  label: string;
};

export type InfiniteScrollContainerProps = {
  containerRef: RefObject<HTMLDivElement | null>;
  viewportHeight: number;
  contentHeight: number;
  children: ReactNode;
};

export type PageContextValue = {
  weeksPerScreen: number;
  setWeeksPerScreen: (v: number) => void;
  mode: CalendarEngineMode;
  setMode: (m: CalendarEngineMode) => void;
};

export type TodayButtonProps = {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
};

export type ModeEffectsParams = {
  initialParams: InitialScrollParams;
  lazyParams: LazyExpansionParams;
};

export type TodayWeekIndexParams = {
  mode: CalendarEngineMode;
};

export type ViewportHeightParams = {
  rowHeight: number;
  weeksPerScreen: number;
};

export type VisibleItemsParams = {
  visibleRange: { startOffset: number; endOffset: number };
  minWeekIndex: number;
};

export type VisibleWindow = { firstWeekIndex: number; lastWeekIndex: number };

export type VisibleLabelParams = {
  visibleWindow: VisibleWindow;
  totalWeeks: number;
  minWeekIndex: number;
  mode: string;
};

export type VisibleRangeParams = {
  minWeekIndex: number;
  maxWeekIndex: number;
  scrollTop: number;
  rowHeight: number;
  viewportHeight: number;
  overScan: number;
};

export type VisibleWindowParams = {
  minWeekIndex: number;
  maxWeekIndex: number;
  scrollTop: number;
  rowHeight: number;
  viewportHeight: number;
};
