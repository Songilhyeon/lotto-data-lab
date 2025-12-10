// global.d.ts
export {};

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag: Gtag;
  }

  interface Gtag {
    (command: "js", date: Date): void;
    (command: "config", measurementId: string, config?: GtagConfig): void;
    (command: "event", eventName: string, eventParams?: GtagEventParams): void;
  }

  interface GtagConfig {
    page_path?: string;
    page_title?: string;
    send_page_view?: boolean;
    [key: string]: unknown;
  }

  interface GtagEventParams {
    event_category?: string;
    event_label?: string;
    value?: number;
    [key: string]: unknown;
  }
}
