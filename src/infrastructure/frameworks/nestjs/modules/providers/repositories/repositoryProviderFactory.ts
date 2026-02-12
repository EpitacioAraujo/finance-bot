import { Provider } from '@nestjs/common';
import { DataSource } from 'typeorm';

/**
 * Repository Provider Factory
 * Simplifica a criação de providers de repositório
 *
 * @example
 * createRepositoryProvider({
 *   token: PRODUCT_REPOSITORY_TOKEN,
 *   schema: ProductSchema,
 *   repositoryClass: TypeOrmProductRepository,
 * })
 */
export function createRepositoryProvider<T>(config: {
  token: string;
  schema: new () => any;
  repositoryClass: new (repository: any) => T;
}): Provider {
  return {
    provide: config.token,
    useFactory: (dataSource: DataSource) =>
      new config.repositoryClass(dataSource.getRepository(config.schema)),
    inject: [DataSource],
  };
}
