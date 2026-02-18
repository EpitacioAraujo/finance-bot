import { ulid } from 'ulid';
import { JwtPayload } from '@/domain/entities/auth/JwtPayload';
import { Session } from '@/domain/entities/auth/Session';
import { SessionRepository } from '@/domain/ports/repositories/SessionRepository';
import { RefreshTokenService } from '@/domain/ports/services/RefreshTokenService';
import { TokenService } from '@/domain/ports/services/TokenService';
import { TokenPolicy } from '@/domain/entities/auth/TokenPolicy';
import { InputDTO } from "./input.dto";
import { OutputDTO } from "./output.dto";

export class CreateNewSessionFacade {
    constructor(
        private readonly sessionRepository: SessionRepository,
        private readonly tokenService: TokenService,
        private readonly refreshTokenService: RefreshTokenService,
    ) {}

    async execute(input: InputDTO): Promise<OutputDTO> {
        const { user, ipAddress, userAgent } = input;

        const deviceId = ulid();
        const refreshToken = this.refreshTokenService.generate();
        const refreshTokenHash = this.refreshTokenService.hash(refreshToken);

        const session = new Session({
            userId: user.id,
            user,
            deviceId,
            refreshTokenHash,
            tokenVersion: user.tokenVersion,
            ipAddress,
            userAgent,
            expiresAt: TokenPolicy.refreshTokenExpiresAt(),
        });
        
        await this.sessionRepository.store(session);

        const payload = new JwtPayload({
            sub: user.id,
            sid: session.id,
            did: deviceId,
            tv: user.tokenVersion,
            jti: ulid(),
        });
        const accessToken = await this.tokenService.generateAccessToken(payload);

        return {
            accessToken,
            refreshToken,
        }
    }
}