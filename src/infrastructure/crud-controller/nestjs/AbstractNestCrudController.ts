/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Post as NestHttpPost,
  Put as NestHttpPut,
  Get as NestHttpGet,
  Delete as NestHttpDelete,
  Req,
  Param,
  Res,
} from '@nestjs/common';

import type { Request, Response } from 'express';

import { Delete } from '@/domain/ports/repositories/components/Delete';
import { Get } from '@/domain/ports/repositories/components/Get';
import { Search } from '@/domain/ports/repositories/components/Search';
import { Store } from '@/domain/ports/repositories/components/Store';

type Routes = 'create' | 'update' | 'delete' | 'get' | 'search';

type DisabledRoutes = Array<Routes>;

type Parsers<T, Filter> = Record<Routes, (req: Request) => T | Filter>;

type ValidationResult = Array<string>;

type Validators = Record<
  Routes,
  (data: any) => Promise<ValidationResult | null>
>;

type EntityFabricator<T> = (data: any) => T;

type Options<T, Filter> = {
  disabled_routes?: DisabledRoutes;
  parsers: Parsers<T, Filter>;
  validators: Validators;
  entityFabricator: EntityFabricator<T>;
};

type EntityRepository<T, TFilters> = Store<T> &
  Get<T> &
  Search<T, TFilters> &
  Delete<T>;

export class AbstractNestCrudController<
  Entity,
  EntityFilter,
  Repository extends EntityRepository<Entity, EntityFilter>,
> {
  disabled_routes: DisabledRoutes = [];
  parsers: Parsers<Entity, EntityFilter>;
  validators: Validators;
  entityFabricator: EntityFabricator<Entity>;

  constructor(
    protected readonly repository: Repository,
    options: Options<Entity, EntityFilter>,
  ) {
    this.disabled_routes = options.disabled_routes || [];
    this.parsers = options.parsers;
    this.validators = options.validators;
    this.entityFabricator =
      options.entityFabricator || ((data) => data as Entity);
  }

  @NestHttpPost()
  async create(@Req() req: Request, @Res() res: Response): Promise<any> {
    if (this.disabled_routes.includes('create')) {
      throw new Error('Route not found.');
    }

    const data = this.parsers['create']
      ? this.parsers['create'](req)
      : req.body;

    if (this.validators['create']) {
      const errors = await this.validators['create'](data);
      if (errors) {
        return res.status(400).json(errors);
      }
    }

    const result = await this.repository.store(this.entityFabricator(data));
    return res.status(201).json(result);
  }

  @NestHttpPut(':id')
  async update(@Req() req: Request): Promise<Entity> {
    if (this.disabled_routes.includes('update')) {
      throw new Error('Route not found.');
    }

    const data = this.parsers['update']
      ? this.parsers['update'](req)
      : req.body;

    if (this.validators['update'] && (await this.validators['update'](data))) {
      throw new Error('Validation failed.');
    }

    const item = await this.repository.get(data.id);

    if (!item) {
      throw new Error('Item not found.');
    }

    return this.repository.store(this.entityFabricator({ ...item, ...data }));
  }

  @NestHttpDelete(':id')
  async delete(@Req() req: Request, @Param('id') id: string): Promise<void> {
    if (this.disabled_routes.includes('delete')) {
      throw new Error('Route not found.');
    }

    const data = this.parsers['delete']
      ? this.parsers['delete']({ id, ...req.body })
      : { id, ...req.body };

    if (this.validators['delete'] && (await this.validators['delete'](data))) {
      throw new Error('Validation failed.');
    }

    const item = await this.repository.get(id);

    if (!item) {
      throw new Error('Item not found.');
    }

    return this.repository.delete(this.entityFabricator(item));
  }

  @NestHttpGet(':id')
  async get(
    @Req() req: Request,
    @Param('id') id: string,
  ): Promise<Entity | null> {
    if (this.disabled_routes.includes('get')) {
      throw new Error('Route not found.');
    }

    const data = this.parsers['get']
      ? this.parsers['get']({ id } as any)
      : { id };

    if (this.validators['get'] && (await this.validators['get'](data))) {
      throw new Error('Validation failed.');
    }

    return this.repository.get(id);
  }

  @NestHttpGet()
  async search(@Req() req: Request): Promise<Entity[] | null> {
    if (this.disabled_routes.includes('search')) {
      throw new Error('Route not found.');
    }

    const data = this.parsers['search'](req);

    if (this.validators['search'] && (await this.validators['search'](data))) {
      throw new Error('Validation failed.');
    }

    return this.repository.search(data as EntityFilter);
  }
}
