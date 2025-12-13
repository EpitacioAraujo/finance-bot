import { type DependencyContainer } from "tsyringe"

// Ports - Providers
import { AIProviderPort } from "@app/Domain/Ports/Providers/AIProvider"

// Ports - Repositories
import { EntryRepository } from "@app/Domain/Ports/Repositories/EntryRepository"
import { UserRepository } from "@app/Domain/Ports/Repositories/UserRepository"
import { TransactionRepository } from "@app/Domain/Ports/Repositories/TransactionRepository"
import { TransactionGroupRepository } from "@app/Domain/Ports/Repositories/TransactionGroupRepository"
import { TransactionGroupDueRepository } from "@app/Domain/Ports/Repositories/TransactionGroupDueRepository"

// Adapters - repositories
import { TypeOrmEntryRepository } from "@app/Infrastructure/Adapters/Repositories/TypeORM/EntryRepository"
import { TypeOrmUserRepository } from "@app/Infrastructure/Adapters/Repositories/TypeORM/UserRepository"
import { TypeOrmTransactionRepository } from "@app/Infrastructure/Adapters/Repositories/TypeORM/TransactionRepository"
import { TypeOrmTransactionGroupRepository } from "@app/Infrastructure/Adapters/Repositories/TypeORM/TransactionGroupRepository"
import { TypeOrmTransactionGroupDueRepository } from "@app/Infrastructure/Adapters/Repositories/TypeORM/TransactionGroupDueRepository"

// Adapters - providers
import { AssemblyAIServiceProvider } from "@app/Infrastructure/ServiceProviders/AI/AssemblyAI"
import { DeepSeekServiceProvider } from "@app/Infrastructure/ServiceProviders/AI/Deepseek"
import { AiProvider } from "@app/Infrastructure/Adapters/Provider/AiProvider/AiProvider"

// Use Cases
import { ProcessCommandUseCase } from "@app/Application/UseCases/ProcessComand"

// Controllers
import { RootController } from "../../Http/Controllers/Root"
import { Env } from "@app/Domain/Entities/Env"
import { AppDataSourceFactory } from "../TypeORM/data-source"
import { DataSource } from "typeorm"

export async function bootstrapContainer(
  container: DependencyContainer
): Promise<void> {
  container.registerSingleton(Env)

  const appDataSource = await new AppDataSourceFactory(
    container.resolve(Env)
  ).make()

  // Register DataSource by its class type so tsyringe can inject it
  container.registerInstance<DataSource>("DataSource", appDataSource)

  // Register repositories
  container.register(typeof UserRepository, TypeOrmUserRepository)
  container.register(typeof EntryRepository, TypeOrmEntryRepository)
  container.register(typeof TransactionRepository, TypeOrmTransactionRepository)
  container.register(
    typeof TransactionGroupRepository,
    TypeOrmTransactionGroupRepository
  )
  container.register(
    typeof TransactionGroupDueRepository,
    TypeOrmTransactionGroupDueRepository
  )
  container.registerSingleton(AssemblyAIServiceProvider)
  container.registerSingleton(DeepSeekServiceProvider)
  container.registerSingleton(AiProvider)
  // Register interface to implementation mapping
  container.register(typeof AIProviderPort, AiProvider)

  // Register application use cases with factory
  container.registerSingleton(ProcessCommandUseCase)

  // Register controllers
  container.registerSingleton(RootController)
}
