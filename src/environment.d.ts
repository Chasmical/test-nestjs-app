export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly PORT?: string;
      readonly DATABASE_URL?: string;
    }
  }
}
