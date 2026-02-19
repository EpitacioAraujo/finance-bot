import { Controller, Get, Inject, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import * as zod from 'zod';

import { PaymentType } from '@/domain/entities/business/PaymentType';
import type { PaymentTypeRepository } from '@/domain/ports/repositories/PaymentTypeRepository';
import { PAYMENT_TYPE_REPOSITORY_TOKEN } from '@/infrastructure/frameworks/nestjs/modules/providers';

import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { BusinessError } from '@/domain/errors/BusinessError';
import { zodErrorFormatter } from '@/infrastructure/config/zod';

@Controller('payment-types')
@UseGuards(JwtAuthGuard)
export class PaymentTypeController {
	constructor(
		@Inject(PAYMENT_TYPE_REPOSITORY_TOKEN)
		private readonly repository: PaymentTypeRepository,
	) {}

	@Post()
	async create(@Req() request: Request, @Res() response: Response) {
		const inputShape = zod.object({
			name: zod.string({ error: "Nome é obrigatório" }),
			cycle_type: zod.enum(['monthly', 'yearly'], { error: "Tipo de ciclo deve ser 'monthly' ou 'yearly'" }),
			cycle_day_start: zod.number({ error: "Dia de início do ciclo é obrigatório e deve ser um número" }).min(1, { error: "Dia de início do ciclo deve ser entre 1 e 28" }).max(28, { error: "Dia de início do ciclo deve ser entre 1 e 28" }),
			cycle_day_end: zod.number({ error: "Dia de fim do ciclo é obrigatório e deve ser um número" }).min(1, { error: "Dia de fim do ciclo deve ser entre 1 e 28" }).max(28, { error: "Dia de fim do ciclo deve ser entre 1 e 28" }),
		});

		const input = inputShape.safeParse(request.body);

		if (!input.success) {
			throw new BusinessError('Invalid input', 422, zodErrorFormatter(input.error));
		}

		const result = await this.repository.store(new PaymentType({
			name: input.data.name,
			cycle_type: input.data.cycle_type,
			cycle_day_start: input.data.cycle_day_start,
			cycle_day_end: input.data.cycle_day_end,
		}));

		return response.status(201).json(result);
	}

	@Get(':id')
	async get(@Req() request: Request) {
		// const input = GetPaymentTypeDto.parse(request);
		
		// const invalidations = await GetPaymentTypeDto.validate(input);
		
		// if (invalidations) {
		// 	return {
		// 		errors: invalidations,
		// 	};
		// }
		return this.repository.get(request.params.id as string);
	}

	@Get()
	async search(@Req() request: Request) {
		const result = await this.repository.search({});
		return result;
	}
}
