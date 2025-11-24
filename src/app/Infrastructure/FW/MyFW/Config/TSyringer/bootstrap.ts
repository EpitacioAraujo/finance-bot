import { type DependencyContainer } from "tsyringe";

// Ports - Providers
import { AIProviderPort } from "@app/Domain/Ports/Providers/AIProvider";

// Ports - Repositories
import { EntryRepository } from "@app/Domain/Ports/Repositories/EntryRepository";

// Adapters - repositories
import { EntryRepositoryFactory } from "@app/Infrastructure/Adapters/Repositories/TypeORM/EntryRepository";
import { UserRepositoryFactory } from "@app/Infrastructure/Adapters/Repositories/TypeORM/UserRepository";

// Adapters - providers
import { AssemblyAIServiceProvider } from "@app/Infrastructure/ServiceProviders/AI/AssemblyAI";
import { DeepSeekServiceProvider } from "@app/Infrastructure/ServiceProviders/AI/Deepseek";
import { AiProvider } from "@app/Infrastructure/Adapters/Provider/AiProvider";

// Use Cases
import { ProcessCommandUseCase } from "@app/Application/UseCases/ProcessComand";

// Controllers
import { RootController } from "../../Http/Controllers/Root";
import { Env } from "@app/Domain/Entities/Env";
import { AppDataSourceFactory } from "../TypeORM/data-source";

export async function bootstrapContainer(container: DependencyContainer): Promise<void> {
    container.registerSingleton(Env);

    const appDataSourceFactory = new AppDataSourceFactory(container.resolve(Env)).make()
    container.registerInstance("DataSource", appDataSourceFactory);

    // Register repositories
    container.register("EntryRepository", {
        useFactory: (c) => {
            return new EntryRepositoryFactory(
                c.resolve("DataSource")
            ).make();
        },
    });
    container.register("UserRepository", {
        useFactory: (c) => {
            return new UserRepositoryFactory(
                c.resolve("DataSource")
            ).make();
        },
    });

    container.registerSingleton(AssemblyAIServiceProvider);
    container.registerSingleton(DeepSeekServiceProvider);
    container.registerSingleton(AiProvider);

    // Register interface to implementation mapping
    container.register<AIProviderPort>("AIProviderPort", {
        useClass: AiProvider,
    });

    // Register application use cases with factory
    container.register(ProcessCommandUseCase, {
        useFactory: (c) => {
            return new ProcessCommandUseCase(
                c.resolve<EntryRepository>("EntryRepository"),
                c.resolve<AIProviderPort>("AIProviderPort")
            );
        },
    });

    // Register controllers
    container.registerSingleton(RootController);
}