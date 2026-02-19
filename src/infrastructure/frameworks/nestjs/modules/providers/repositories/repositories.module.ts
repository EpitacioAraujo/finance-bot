import { Module } from '@nestjs/common';
import { Provider } from '@nestjs/common';

// Adapters/Implementations
import { TypeOrmUserRepository } from '@/infrastructure/adapters/repositories/TypeOrmUserRepository';
import { TypeOrmSessionRepository } from '@/infrastructure/adapters/repositories/TypeOrmSessionRepository';
import { TypeOrmTransactionRepository } from '@/infrastructure/adapters/repositories/TypeOrmTransactionRepository';
import { TypeOrmPaymentTypeRepository } from '@/infrastructure/adapters/repositories/TypeOrmPaymentTypeRepository';

// Database Schemas
import {
  UserSchema,
  SessionSchema,
  TransactionSchema,
  PaymentTypeSchema,
  PaymentCycleSchema,
} from '@/infrastructure/config/typeorm/schemas';
import { createRepositoryProvider } from './repositoryProviderFactory';
import { TypeOrmPaymentCycleRepository } from '@/infrastructure/adapters/repositories/TypeOrmPaymentCycleRepository';

// Token constants for dependency injection
export const CART_REPOSITORY_TOKEN = 'CartRepository';
export const PRODUCT_REPOSITORY_TOKEN = 'ProductRepository';
export const ORDER_REPOSITORY_TOKEN = 'OrderRepository';
export const CUSTOMER_REPOSITORY_TOKEN = 'CustomerRepository';
export const USER_REPOSITORY_TOKEN = 'UserRepository';
export const STOCK_REPOSITORY_TOKEN = 'StockRepository';
export const SESSION_REPOSITORY_TOKEN = 'SessionRepository';
export const TRANSACTION_REPOSITORY_TOKEN = 'TransactionRepository';
export const PAYMENT_TYPE_REPOSITORY_TOKEN = 'PaymentTypeRepository';
export const PAYMENT_CYCLE_REPOSITORY_TOKEN = 'PaymentCycleRepository';


/**
 * Repository Providers Factory
 * Centraliza todas as factories de repositories
 *
 * Este módulo fornece os providers para todos os repositórios da aplicação,
 * implementados com TypeORM. Cada repositório é uma factory que injeta
 * o Repository<T> do TypeORM necessário.
 *
 * ✅ Usa o DataSource global - não precisa de TypeOrmModule.forFeature()
 * ✅ Para adicionar um novo repositório, apenas adicione um objeto à lista
 *
 * Os schemas já estão carregados no TypeOrmModule.forRoot() do AppModule
 */
const repositoryProviders: Provider[] = [
  createRepositoryProvider({
    token: USER_REPOSITORY_TOKEN,
    schema: UserSchema,
    repositoryClass: TypeOrmUserRepository,
  }),
  createRepositoryProvider({
    token: SESSION_REPOSITORY_TOKEN,
    schema: SessionSchema,
    repositoryClass: TypeOrmSessionRepository,
  }),
  createRepositoryProvider({
    token: TRANSACTION_REPOSITORY_TOKEN,
    schema: TransactionSchema,
    repositoryClass: TypeOrmTransactionRepository,
  }),
  createRepositoryProvider({
    token: PAYMENT_TYPE_REPOSITORY_TOKEN,
    schema: PaymentTypeSchema,
    repositoryClass: TypeOrmPaymentTypeRepository,
  }),
  createRepositoryProvider({
    token: PAYMENT_CYCLE_REPOSITORY_TOKEN,
    schema: PaymentCycleSchema,
    repositoryClass: TypeOrmPaymentCycleRepository,
  }),
];

@Module({
  providers: repositoryProviders,
  exports: repositoryProviders,
})
export class RepositoriesModule {}
