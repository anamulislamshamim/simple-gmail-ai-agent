import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: "http://localhost:3000",
    advanced: {
        cookiePrefix: "session" 
    },
    fetchOptions: {
        credentials: "include"
    }
})