import { ulid } from 'ulid';
import { BusinessError } from '@/domain/errors/BusinessError';
import { JwtPayload } from '@/domain/entities/auth/JwtPayload';
import { SessionRepository } from '@/domain/ports/repositories/SessionRepository';
import { UserRepository } from '@/domain/ports/repositories/UserRepository';
import { RefreshTokenService } from '@/domain/ports/services/RefreshTokenService';
import { TokenService } from '@/domain/ports/services/TokenService';
import { TokenPolicy } from '@/domain/entities/auth/TokenPolicy';
import { InputDTO } from './input.dto';
import { OutputDTO } from './output.dto';

export class RefreshTokenUseCase {
    constructor(
        private readonly sessionRepository: SessionRepository,
        private readonly userRepository: UserRepository,
        private readonly tokenService: TokenService,
        private readonly refreshTokenService: RefreshTokenService,
    ) {}

    async execute(input: InputDTO): Promise<OutputDTO> {
        const { refreshToken, ipAddress, userAgent } = input;
        
        try {
            if (!refreshToken) {
                throw new BusinessError('Refresh token ausente', 401);
            }

            const refreshTokenHash = this.refreshTokenService.hash(refreshToken);

            // 1. Busca a sessão pelo hash do refresh token
            const sessions = await this.sessionRepository.search({
                refreshTokenHash,
            });

            const session = sessions[0];

            // 2. Verifica se a sessão existe e está ativa
            if (!session || !session.isActive()) {
                throw new BusinessError('Sessão inválida ou expirada', 401);
            }

            // 3. Busca o usuário
            const user = await this.userRepository.get(session.userId);
    
            if (!user) {
                throw new BusinessError('Usuário não encontrado', 404);
            }

            if (session.tokenVersion !== user.tokenVersion) {
                session.revoke();
                await this.sessionRepository.store(session);
                throw new BusinessError('Sessão inválida ou expirada', 401);
            }

            // 4. Rotaciona o refresh token na sessão existente
            const newRefreshToken = this.refreshTokenService.generate();
            session.refreshTokenHash = this.refreshTokenService.hash(newRefreshToken);
            session.expiresAt = TokenPolicy.refreshTokenExpiresAt();
            session.ipAddress = ipAddress ?? session.ipAddress;
            session.userAgent = userAgent ?? session.userAgent;

            await this.sessionRepository.store(session);

            const payload = new JwtPayload({
                sub: user.id,
                sid: session.id,
                did: session.deviceId,
                tv: user.tokenVersion,
                jti: ulid(),
            });

            const accessToken = await this.tokenService.generateAccessToken(payload);

            return {
                accessToken,
                refreshToken: newRefreshToken,
            };
        } catch (error) {
            if (error instanceof BusinessError) {
            throw error;
            }
            throw new BusinessError('Token inválido', 401);
        }
    }
}