import { Global, Module } from '@nestjs/common';

// Submodules
import { RepositoriesModule } from './repositories/repositories.module';
import { ServicesModule } from './services/services.module';
import { UseCasesModule } from './use-cases/use-cases.module';

/**
 * Main Providers Module (Global)
 * Centraliza e orquestra todos os módulos de factories
 *
 * Este módulo organiza as factories em três grupos principais:
 * - Repositories: adaptadores TypeORM para repositórios
 * - Services: serviços externos como autenticação e criptografia
 * - UseCases: casos de uso da aplicação
 *
 * @Global - Todas as factories estão disponíveis globalmente.
 * Basta injetar o token desejado sem precisar importar este módulo.
 *
 * Exemplo de uso plug-and-play:
 * ```typescript
 * constructor(
 *   @Inject(PRODUCT_REPOSITORY_TOKEN) productRepo: ProductRepository,
 *   @Inject(REGISTER_USE_CASE_TOKEN) registerUseCase: RegisterUseCase,
 * ) {}
 * ```
 */
@Global()
@Module({
  imports: [RepositoriesModule, ServicesModule, UseCasesModule],
  exports: [RepositoriesModule, ServicesModule, UseCasesModule],
})
export class ProvidersModule {}
