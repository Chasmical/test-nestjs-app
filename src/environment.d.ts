export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly NODE_ENV?: string;
      readonly PORT?: string;
      readonly DATABASE_URL?: string;
      readonly GRAPHQL_MAX_COMPLEXITY?: string;
    }
  }
}
