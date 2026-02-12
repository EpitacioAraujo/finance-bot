import { JwtPayload } from "@/domain/entities/auth/JwtPayload";
import { Session } from "@/domain/entities/auth/Session";
import { SessionRepository } from "@/domain/ports/repositories/SessionRepository";
import { TokenService } from "@/domain/ports/services/TokenService";
import { InputDTO } from "./input.dto";
import { OutputDTO } from "./output.dto";

export class CreateNewSessionFacade {
    constructor(
        private readonly sessionRepository: SessionRepository,
        private readonly tokenService: TokenService,
    ) {}

    async execute(input: InputDTO): Promise<OutputDTO> {
        const { user } = input;

        const session = new Session({
            userId: user.id,
            user,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
        });
        
        await this.sessionRepository.store(session);

        const payload = new JwtPayload({ sessionId: session.id });
        const accessToken = await this.tokenService.generateAccessToken(payload);
        const refreshToken = await this.tokenService.generateRefreshToken(payload);

        return {
            accessToken,
            refreshToken,
        }
    }
}