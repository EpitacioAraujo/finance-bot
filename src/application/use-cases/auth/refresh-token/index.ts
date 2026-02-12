import { CreateNewSessionFacade } from "@/application/facades/create-new-session";
import { BusinessError } from "@/domain/errors/BusinessError";
import { SessionRepository } from "@/domain/ports/repositories/SessionRepository";
import { UserRepository } from "@/domain/ports/repositories/UserRepository";
import { TokenService } from "@/domain/ports/services/TokenService";
import { InputDTO } from "./input.dto";
import { OutputDTO } from "./output.dto";

export class RefreshTokenUseCase {
    constructor(
        private readonly sessionRepository: SessionRepository,
        private readonly userRepository: UserRepository,
        private readonly tokenService: TokenService,
        private readonly createNewSessionFacade: CreateNewSessionFacade,
    ) {}

    async execute(input: InputDTO): Promise<OutputDTO> {
        const { refreshToken, authenticatedUser } = input;
        
        try {

            // 1. Valida o JWT e extrai o sessionId
            const token_payload = await this.tokenService.validateToken(refreshToken);
    
            // 2. Busca a sessão no banco
            const session = await this.sessionRepository.get(token_payload.sessionId);
    
            // 3. Verifica se a sessão existe, está ativa e pertence ao usuário autenticado
            if (!session || !session.isActive() || session.userId !== authenticatedUser.id) {
                throw new BusinessError('Sessão inválida ou expirada', 401);
            }

            // 4. Busca o usuário
            const user = await this.userRepository.get(session.userId);
    
            if (!user) {
                throw new BusinessError('Usuário não encontrado', 404);
            }
    
            // 5. Revogar sessão para refletir a renovação do token
            session.revoke();

            this.sessionRepository.store(session);

            const new_session = await this.createNewSessionFacade.execute({ user });

            return new_session;
        } catch (error) {
            if (error instanceof BusinessError) {
            throw error;
            }
            throw new BusinessError('Token inválido', 401);
        }
    }
}