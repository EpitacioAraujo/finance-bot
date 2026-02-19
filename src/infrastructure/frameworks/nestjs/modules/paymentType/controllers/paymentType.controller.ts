import { Controller, Get, Inject, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';

import { AbstractNestCrudController } from '@/infrastructure/crud-controller/nestjs/AbstractNestCrudController';
import { PaymentType } from '@/domain/entities/business/PaymentType';
import { PaymentTypeFilters } from '@/domain/ports/repositories/PaymentTypeRepository';
import type { PaymentTypeRepository } from '@/domain/ports/repositories/PaymentTypeRepository';
import { PAYMENT_TYPE_REPOSITORY_TOKEN } from '@/infrastructure/frameworks/nestjs/modules/providers';

import { CreatePaymentTypeDto } from './dtos/create-input.dto';
import { DeletePaymentTypeDto } from './dtos/delete-input.dto';
import { GetPaymentTypeDto } from './dtos/get-input.dto';
import { SearchPaymentTypeDto } from './dtos/search-input.dto';
import { UpdatePaymentTypeDto } from './dtos/update-input.dto';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { BusinessError } from '@/domain/errors/BusinessError';

@Controller('payment-types')
@UseGuards(JwtAuthGuard)
export class PaymentTypeController {
	constructor(
		@Inject(PAYMENT_TYPE_REPOSITORY_TOKEN)
		private readonly repository: PaymentTypeRepository,
	) {}

	@Post()
	async create(@Req() request: Request, @Res() response: Response) {
		const input = CreatePaymentTypeDto.parse(request);

		const invalidations = await CreatePaymentTypeDto.validate(input);
		if (invalidations) {
			throw new BusinessError('Invalid input', 400, invalidations);
		}

		const result = await this.repository.store(new PaymentType({
			name: input.name,
			cycle_type: input.cycle_type,
			cycle_day_start: input.cycle_day_start,
			cycle_day_end: input.cycle_day_end,
		}));

		return response.status(201).json(result);
	}

	@Get(':id')
	async get(@Req() request: Request) {
		const input = GetPaymentTypeDto.parse(request);
		
		const invalidations = await GetPaymentTypeDto.validate(input);
		
		if (invalidations) {
			return {
				errors: invalidations,
			};
		}
		return this.repository.get(input.id);
	}

	@Get()
	async search(@Req() request: Request) {
		const result = await this.repository.search({});
		return result;
	}
}
