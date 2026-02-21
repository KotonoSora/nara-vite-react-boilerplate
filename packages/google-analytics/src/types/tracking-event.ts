export type TrackingEvent = {
  event_category: string;
  event_label: string;
  event_action?: string;
  event_value?: string;
  [key: string]: string | number | undefined;
};
