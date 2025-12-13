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
import { AiProvider } from "@app/Infrastructure/Adapters/Provider/AiProvider"

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
  container.registerInstance("DataSource", appDataSource)
  container.registerInstance(DataSource, appDataSource)

  // Register repositories
  container.register<UserRepository>("UserRepository", TypeOrmUserRepository)
  container.register<EntryRepository>("EntryRepository", TypeOrmEntryRepository)
  container.register<TransactionRepository>(
    "TransactionRepository",
    TypeOrmTransactionRepository
  )
  container.register<TransactionGroupRepository>(
    "TransactionGroupRepository",
    TypeOrmTransactionGroupRepository
  )
  container.register<TransactionGroupDueRepository>(
    "TransactionGroupDueRepository",
    TypeOrmTransactionGroupDueRepository
  )

  container.registerSingleton(AssemblyAIServiceProvider)
  container.registerSingleton(DeepSeekServiceProvider)
  container.registerSingleton(AiProvider)

  // Register interface to implementation mapping
  container.register<AIProviderPort>("AIProviderPort", {
    useClass: AiProvider,
  })

  // Register application use cases with factory
  container.register(ProcessCommandUseCase, {
    useFactory: (c) => {
      return new ProcessCommandUseCase(
        c.resolve<EntryRepository>("EntryRepository"),
        c.resolve<AIProviderPort>("AIProviderPort")
      )
    },
  })

  // Register controllers
  container.registerSingleton(RootController)
}
