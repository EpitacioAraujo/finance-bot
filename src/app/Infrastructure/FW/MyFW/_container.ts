import { container } from "tsyringe";
import { DataSource } from "typeorm";

// Entities
import { Env } from "@app/Domain/Entities/Env";

// Ports
import { EntryRepository } from "@app/Domain/Ports/Repositories/EntryRepository";
import { UserRepository } from "@app/Domain/Ports/Repositories/UserRepository";

// Use Cases
import { ProcessCommandUseCase } from "@app/Application/UseCases/ProcessComand";

// Adapters
import { EntryRepositoryFactory } from "@app/Infrastructure/Adapters/Repositories/TypeORM/EntryRepository";
import { UserRepositoryFactory } from "@app/Infrastructure/Adapters/Repositories/TypeORM/UserRepository";

// Services
import { AssemblyAIServiceProvider } from "@app/Infrastructure/ServiceProviders/AI/AssemblyAI";
import { DeepSeekServiceProvider } from "@app/Infrastructure/ServiceProviders/AI/Deepseek";
import { WhatsAppMetaAPI } from "@app/Infrastructure/ServiceProviders/WhatsApp/MetaService/Api";

// DataSource
import { AppDataSourceFactory } from "./Config/TypeORM/data-source";

// Controllers
import { RootController } from "./Http/Controllers/Root";
import { WhatsappMessageReciveController } from "./Http/WebHooks/MetaAPI/WhatsappMessageReciveController";

/**
 * Configure and initialize the dependency injection container
 */
export async function configureContainer(): Promise<void> {
  // Register Env as singleton
  container.registerSingleton<Env>(Env);

  // Initialize and register DataSource
  const env = container.resolve(Env);
  const appDataSourceFactory = new AppDataSourceFactory(env);
  const dataSource = await appDataSourceFactory.dataSource.initialize();
  container.registerInstance<DataSource>(DataSource, dataSource);

  // Register repositories
  const entryRepository = new EntryRepositoryFactory(dataSource).make();
  const userRepository = new UserRepositoryFactory(dataSource).make();

  container.registerInstance<EntryRepository>(
    "EntryRepository",
    entryRepository
  );
  container.registerInstance<UserRepository>("UserRepository", userRepository);

  // Register services as singletons
  container.registerSingleton(AssemblyAIServiceProvider);
  container.registerSingleton(DeepSeekServiceProvider);
  container.registerSingleton(WhatsAppMetaAPI);

  // Register use cases
  container.registerSingleton(ProcessCommandUseCase);
  // Note: LoadDashBoardUseCase requires Repository<Entry>, registering it would need adjustment

  // Register controllers
  container.registerSingleton(WhatsappMessageReciveController);

  // Register controllers
  container.register("RootController", {
    useFactory: (c) => {
      return new RootController(
        c.resolve(ProcessCommandUseCase)
      );
    }
  });

  console.log("✓ Dependency injection container configured successfully");
}

export { container };
