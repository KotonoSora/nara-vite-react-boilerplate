# Vertical calendar — infinite vertical scroll

This document describes the vertical calendar view used in `calendar._index`. It explains the feature, the contract (inputs/outputs), developer usage, accessibility and performance considerations, and recommended tests.

## Overview

The vertical calendar implements an infinite vertical scroll UX for month-based navigation. As the user scrolls, adjacent months are loaded on demand and DOM is recycled where possible so the UI remains smooth and memory-friendly.

Key goals:

- Seamless forward/backward month navigation by vertical scrolling.
- Predictable rendering and stable visual position when months are prepended or appended.
- Responsive performance on low-end devices and strong accessibility support.

## Contract (inputs / outputs / error modes)

- Inputs:
  - `initialDate: Date` — month to show initially (defaults to today).
  - `loadRange(date, direction): Promise<MonthData>` — fetches events/metadata for month(s). `direction` is `'backward' | 'forward'`.
  - `renderDay(dayData): ReactNode` — optional renderer for a day cell (falls back to default).
  - `pageSize?: number` — months to load per fetch (defaults to 1).

- Outputs / callbacks:
  - `onVisibleMonth(date: Date)` — called when the visible month changes.
  - `onSelectDate(date: Date)` — called when a date is selected.

- Error modes:
  - Network/load failures: show a compact inline retry UI for the affected month and render a fixed-height placeholder to avoid layout jumps.

## Behavior & UX details

- Initial render loads `initialDate` plus required adjacent months to fill the viewport.
- Scrolling near the top triggers loading and prepending previous months while preserving the user's scroll position.
- Scrolling near the bottom triggers loading and appending next months.
- Maintain a sliding window of mounted months (for example, keep ~7 months around the viewport) and unmount older months to bound memory.
- When prepending months, compute the new months' total height and adjust `container.scrollTop` so the visual position stays stable.

## Accessibility

- Use semantic grid/table markup or `role="grid"` for the month view and include labels (`aria-label`) and cell coordinates (`aria-rowindex`/`aria-colindex`).
- Keyboard support: arrow keys to move between days, Enter/Space to select, PageUp/PageDown to jump by visible month.
- Use an `aria-live` region to announce visible month changes for screen reader users.

## Performance notes

- Virtualize at the month container level (not necessarily every day) for simpler measurement and consistent heights.
- Debounce scroll handling and use `IntersectionObserver` to detect when to load more months.
- Prefetch near-future months at low priority (`requestIdleCallback` or scheduler) and cancel prefetches when no longer needed.

## Edge cases

- Very fast scrolling to a distant month: render lightweight placeholders and batch-load intermediate months instead of issuing many concurrent requests.
- Timezone changes: normalize month boundaries to the app's canonical timezone (or UTC) before computing ranges.
- Partial server responses: render day placeholders and rehydrate when full data arrives.

## Tests (recommended)

- Unit tests:
  - visible-month calculation from a given scroll offset.
  - preserving `scrollTop` when prepending months.

- Integration / E2E tests:
  - continuous scroll loading forward and backward.
  - keyboard navigation across loaded and unloaded months.

## Implementation notes / pointers

- Preserving scroll position when prepending:
  1. Record the first visible month node and its offset from the container top.
  2. Insert/prepend new month nodes off-DOM (or hidden), measure their total height.
  3. Increase `container.scrollTop` by that measured height, then reveal the new nodes.

- Data strategy: keep a small LRU cache for month data, cancel inflight loads for months that fall out of the window, and limit concurrent fetches.

## Files & locations

- Primary component(s): `app/routes/calendar._index` and shared calendar components under `app/features`.
- This document: `app/routes/calendar._index/docs/vertical-calendar-infinity-scroll.md`.

## Next steps

- I can add a minimal example component with prop types and a skeleton implementation.
- I can also create unit tests for the visible-month calculations.

Assumptions: this project uses React and a client-side scroll container; if your calendar implementation uses different component names or a server-driven renderer, tell me the component paths and I will adapt the doc and add example code.
