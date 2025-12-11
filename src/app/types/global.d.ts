// global.d.ts
type GtagConfig = {
  page_path?: string;
  [key: string]: unknown;
};

type GtagEventParams = {
  [key: string]: unknown;
};

interface Gtag {
  (command: "js", date: Date): void;
  (command: "config", measurementId: string, config?: GtagConfig): void;
  (command: "event", eventName: string, eventParams?: GtagEventParams): void;
}

declare global {
  interface Window {
    gtag: Gtag;
  }
}

export {};
