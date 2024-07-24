declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test"
      DB_HOSTNAME: string
      DB_PORT: number
      DB_USER: string
      DB_PASSWORD: string
      DB_NAME: string
    }
  }
}

export {}
