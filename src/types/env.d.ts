// Good use of global file: Adding type safety to process.env
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_APP_NAME: string;
    NEXT_PUBLIC_ENV: string;
    NEXT_PUBLIC_APP_URL: string;
    ACCESS_TOKEN_SECRET: string;
    REFRESH_TOKEN_SECRET: string;
    RESET_PASSWORD_TOKEN_SECRET: string;
    ACCESS_TOKEN_EXPIRY: string;
    REFRESH_TOKEN_EXPIRY: string;
    RESET_PASSWORD_TOKEN_EXPIRY: string;
    MONGODB_URI: string;
    NEXT_PUBLIC_SOCKET_URL: string;
  }
}
