import { User } from "@/domain/entities/business/User"

export type InputDTO = {
    user: User
    ipAddress?: string
    userAgent?: string
}