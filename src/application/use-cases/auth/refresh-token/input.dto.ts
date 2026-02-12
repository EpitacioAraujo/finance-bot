import { User } from "@/domain/entities/business/User";

export type InputDTO = {
    refreshToken: string;
    authenticatedUser: User
}