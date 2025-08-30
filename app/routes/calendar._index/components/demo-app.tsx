import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { ReactNode } from "react";

import { cn } from "~/lib/utils";

// ===== Types =====
type CalendarEvent = { id: string; label: string };
type EventsMap = Record<string, CalendarEvent[]>;

type CalendarContextValue = {
  rowHeight: number;
  weeksPerScreen: number;
  overScan: number;
  timezone?: string;
  renderDay?: (day: Date, isToday: boolean) => ReactNode;
  today: Date;
  todayDayIndex: number; // day index (days since epoch)
};

type CalendarProviderProps = {
  children: ReactNode;
  rowHeight?: number | undefined; // if provided, use it; otherwise compute from parentRef
  weeksPerScreen: number;
  overScan: number;
  timezone?: string;
  parentRef: React.RefObject<HTMLDivElement | null>;
  renderDay?: (day: Date, isToday: boolean) => ReactNode;
};

type InfiniteScrollProps = {
  children: (weekIndex: number) => ReactNode;
};

// ===== Utils =====
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const MS_PER_WEEK = MS_PER_DAY * 7;
const WEEK_EPOCH = new Date("1970-01-05");
const DAY_EPOCH = new Date("1970-01-01");

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function getWeekStart(date: Date, weekStartsOn = 1): Date {
  const d = new Date(date);
  const day = (d.getDay() + 7 - weekStartsOn) % 7;
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

function indexToWeek(index: number, epoch = WEEK_EPOCH): Date {
  const d = new Date(epoch);
  d.setDate(d.getDate() + index * 7);
  return getWeekStart(d);
}

function weekToIndex(date: Date, epoch = WEEK_EPOCH): number {
  const start = getWeekStart(date);
  return Math.floor((+start - +epoch) / MS_PER_WEEK);
}

function dayToIndex(date: Date, epoch = DAY_EPOCH): number {
  const sd = startOfDay(date);
  return Math.floor((+sd - +epoch) / MS_PER_DAY);
}

// ===== Context =====
const CalendarContext = createContext<CalendarContextValue | null>(null);

function useCalendar(): CalendarContextValue {
  const ctx = useContext(CalendarContext);
  if (!ctx) throw new Error("useCalendar must be used within CalendarProvider");
  return ctx;
}

// ===== CalendarProvider =====
export function CalendarProvider({
  children,
  rowHeight: rowHeightProp,
  weeksPerScreen,
  overScan,
  timezone,
  renderDay,
  parentRef,
}: CalendarProviderProps) {
  const [rowHeight, setRowHeight] = useState<number>(0);

  // Measure parentRef height on client and update rowHeight.
  // Use useEffect (not useLayoutEffect) so we don't block SSR; provider will render children only after measurement.
  useEffect(() => {
    if (!parentRef?.current) return;

    const measure = () => {
      const h = parentRef.current ? parentRef.current.clientHeight : 0;

      if (h > 0) {
        const computed =
          weeksPerScreen &&
          rowHeightProp &&
          rowHeightProp > 0 &&
          weeksPerScreen !== 0
            ? rowHeightProp
            : Math.floor(h / weeksPerScreen);

        setRowHeight((prev) => (prev !== computed ? computed : prev));
      }
    };

    measure();

    // observe changes
    const ro = new ResizeObserver(measure);
    ro.observe(parentRef.current);
    return () => ro.disconnect();
  }, [parentRef, weeksPerScreen, rowHeightProp]);

  // If explicit prop provided, ensure it's used (in case it's set after mount)
  useEffect(() => {
    if (typeof rowHeightProp === "number" && rowHeightProp > 0) {
      setRowHeight(rowHeightProp);
    }
  }, [rowHeightProp]);

  const today = useMemo(() => new Date(), []);
  const todayDayIndex = useMemo(() => dayToIndex(today), [today]);

  const value = useMemo(
    () => ({
      rowHeight,
      weeksPerScreen,
      overScan,
      timezone,
      renderDay,
      today,
      todayDayIndex,
    }),
    [
      rowHeight,
      weeksPerScreen,
      overScan,
      timezone,
      renderDay,
      today,
      todayDayIndex,
    ],
  );

  // Render children only when rowHeight is known to avoid layout jump / hydration mismatch
  return (
    <CalendarContext.Provider value={value}>
      {rowHeight > 0 ? children : null}
    </CalendarContext.Provider>
  );
}

// ===== InfiniteScroll (lazy expansion, today as first visible week) =====
function InfiniteScroll({ children }: InfiniteScrollProps) {
  const { rowHeight, weeksPerScreen, overScan } = useCalendar();
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Small buffer as you requested
  const BUFFER_WEEKS = Math.max(weeksPerScreen, 1);

  const today = new Date();
  const todayWeekIndex = weekToIndex(today);

  // initial window around today: include some weeks above so user can scroll up
  const [minWeekIndex, setMinWeekIndex] = useState<number>(
    () => todayWeekIndex - BUFFER_WEEKS,
  );
  const [maxWeekIndex, setMaxWeekIndex] = useState<number>(
    () => todayWeekIndex + BUFFER_WEEKS,
  );

  const totalWeeks = maxWeekIndex - minWeekIndex + 1;
  const viewportHeight = rowHeight * weeksPerScreen;

  // scroll state (throttled)
  const [scrollTop, setScrollTop] = useState<number>(0);
  const ticking = useRef(false);

  // Handler: rAF throttle
  const onScroll = useCallback(() => {
    const node = containerRef.current;
    if (!node) return;
    if (!ticking.current) {
      window.requestAnimationFrame(() => {
        setScrollTop(node.scrollTop);
        ticking.current = false;
      });
      ticking.current = true;
    }
  }, []);

  // Attach scroll listener and set initial scroll so today's week is FIRST visible row (top)
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    node.addEventListener("scroll", onScroll, { passive: true });

    // ensure virtual inner exists; schedule initial scroll at next frame to be safe
    requestAnimationFrame(() => {
      // offset from start-of-virtual (minWeekIndex) to today
      const initialOffsetWeeks = todayWeekIndex - minWeekIndex + 1;
      const initialTop = initialOffsetWeeks * rowHeight;
      node.scrollTop = initialTop;
      setScrollTop(initialTop);
    });

    return () => node.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onScroll, rowHeight, minWeekIndex, todayWeekIndex]);

  // Lazy expansion: expand when near edges
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const totalHeight = totalWeeks * rowHeight;
    const topThreshold = BUFFER_WEEKS * rowHeight;
    const bottomThreshold =
      totalHeight - viewportHeight - BUFFER_WEEKS * rowHeight;

    // expand up (prepend)
    if (scrollTop < topThreshold) {
      // expand up by BUFFER_WEEKS
      setMinWeekIndex((prev) => {
        const next = prev - BUFFER_WEEKS;
        // after DOM updates, shift scrollTop down by BUFFER_WEEKS * rowHeight to preserve visible content
        requestAnimationFrame(() => {
          if (!node) return;
          node.scrollTop = node.scrollTop + BUFFER_WEEKS * rowHeight;
          // update local state
          setScrollTop(node.scrollTop);
        });
        return next;
      });
      return;
    }

    // expand down (append)
    if (scrollTop > bottomThreshold) {
      setMaxWeekIndex((prev) => prev + BUFFER_WEEKS);
      return;
    }
  }, [
    scrollTop,
    totalWeeks,
    rowHeight,
    viewportHeight,
    BUFFER_WEEKS,
    setMinWeekIndex,
  ]);

  // compute visible offsets (clamped)
  const firstVisibleOffset = Math.max(0, Math.floor(scrollTop / rowHeight));
  const startOffset = Math.max(0, firstVisibleOffset - overScan);
  const visibleCount = Math.ceil(viewportHeight / rowHeight) + overScan * 2;
  const endOffset = Math.min(totalWeeks - 1, startOffset + visibleCount - 1);

  // render visible week rows
  const items: ReactNode[] = [];
  for (let offset = startOffset; offset <= endOffset; offset++) {
    const weekIndex = minWeekIndex + offset;
    const top = offset * rowHeight;
    items.push(
      <div
        key={`week-${weekIndex}`}
        style={{
          position: "absolute",
          top,
          left: 0,
          right: 0,
          height: rowHeight,
        }}
      >
        {children(weekIndex)}
      </div>,
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative border border-gray-400 overflow-y-scroll bg-white scrollbar-y"
      style={{ height: viewportHeight }}
    >
      <div style={{ position: "relative", height: totalWeeks * rowHeight }}>
        {items}
      </div>
    </div>
  );
}

// ===== WeekRow / DayCell (unchanged behavior) =====
type WeekRowProps = { weekIndex: number };

function WeekRow({ weekIndex }: WeekRowProps) {
  const { rowHeight, todayDayIndex } = useCalendar();

  const weekStart = indexToWeek(weekIndex);

  const days = useMemo(
    () =>
      Array.from({ length: 7 }, (_, j) => {
        const d = new Date(weekStart);
        d.setDate(weekStart.getDate() + j);
        return d;
      }),
    [weekStart],
  );

  return (
    <div
      style={{ height: rowHeight }}
      className="grid grid-cols-7 border-b border-gray-300"
    >
      {days.map((d) => {
        const globalDayIdx = dayToIndex(d);
        const isToday = globalDayIdx === todayDayIndex;
        return <DayCell key={d.toISOString()} day={d} isToday={isToday} />;
      })}
    </div>
  );
}

type DayCellProps = { day: Date; isToday: boolean };

function DayCell({ day, isToday }: DayCellProps) {
  const { renderDay } = useCalendar();

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      const data = e.dataTransfer.getData("text/plain");
      alert(`Dropped ${data} vào ngày ${day.toDateString()}`);
    },
    [day],
  );

  const defaultRender = useCallback((d: Date) => {
    if (d.getDate() === 1) {
      const needsYear = d.getFullYear() !== new Date().getFullYear();
      const fmt = new Intl.DateTimeFormat(undefined, {
        day: "2-digit",
        month: "2-digit",
        ...(needsYear ? { year: "numeric" } : {}),
      } as Intl.DateTimeFormatOptions);
      return <div className="text-sm">{fmt.format(d)}</div>;
    }
    return <div className="text-sm">{d.getDate()}</div>;
  }, []);

  return (
    <div
      className={cn(
        "border-r border-gray-100 p-2 box-border",
        isToday ? "ring-1 ring-inset ring-indigo-200" : "",
      )}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      data-date={day.toDateString()}
    >
      {renderDay ? renderDay(day, isToday) : defaultRender(day)}
    </div>
  );
}

// ===== VirtualCalendar + DemoApp =====
function VirtualCalendar() {
  return (
    <InfiniteScroll>
      {(weekIndex) => <WeekRow weekIndex={weekIndex} />}
    </InfiniteScroll>
  );
}

export function DemoApp({
  weeksPerScreen,
  overScan,
}: {
  weeksPerScreen: number;
  overScan: number;
}) {
  const parentRef = useRef<HTMLDivElement>(null);

  const [events] = useState<EventsMap>({
    "2025-08-30": [
      { id: "task1", label: "Meeting" },
      { id: "task2", label: "Coding" },
    ],
    "2025-08-31": [{ id: "task3", label: "Workout" }],
  });

  const renderDay = useCallback(
    (d: Date, isToday: boolean) => {
      let dateString: string = d.getDate().toString();

      if (d.getDate() === 1) {
        const needsYear = d.getFullYear() !== new Date().getFullYear();
        const fmt = new Intl.DateTimeFormat(undefined, {
          day: "2-digit",
          month: "2-digit",
          ...(needsYear ? { year: "numeric" } : {}),
        } as Intl.DateTimeFormatOptions);
        dateString = fmt.format(d);
      }

      return (
        <div className={cn("text-sm", { "font-bold": isToday })}>
          {dateString}
        </div>
      );
    },
    [events],
  );

  return (
    <div ref={parentRef} className="flex flex-col flex-1">
      <CalendarProvider
        key={weeksPerScreen}
        weeksPerScreen={weeksPerScreen}
        overScan={overScan}
        renderDay={renderDay}
        parentRef={parentRef}
      >
        <VirtualCalendar />
      </CalendarProvider>
    </div>
  );
}
