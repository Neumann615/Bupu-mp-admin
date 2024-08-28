import api from "./axios"
import type { UserLogin } from "@/types/user"

export function login(userLogin: UserLogin) {
    return api.post("/api/admin/login", userLogin)
}