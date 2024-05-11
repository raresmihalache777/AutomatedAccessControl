declare global {
    namespace NodeJS {
      interface ProcessEnv {
        MONGO_URI: string;
        TOKEN_SECRET: string
      }
    }
  }
  export {}