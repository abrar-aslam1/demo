declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATAFORSEO_USERNAME: string
      DATAFORSEO_PASSWORD: string
      NEXT_PUBLIC_SITE_URL: string
      NODE_ENV: 'development' | 'production'
    }
  }
}

export {} 