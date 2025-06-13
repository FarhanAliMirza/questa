import { createAuthClient } from "better-auth/react"
import { BASE_URL } from "./config";
export const authClient = createAuthClient({
    baseURL: BASE_URL
})