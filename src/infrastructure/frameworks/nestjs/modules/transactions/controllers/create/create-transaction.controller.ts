import { Controller, Inject, Post, Req, Res, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "@/infrastructure/frameworks/nestjs/guards/jwt-auth.guard";
import type { Request, Response } from "express";
import * as z from 'zod'

import { CreateTransactionUseCase } from "@/application/use-cases/transaction/create/create-transaction-usecase";
import { InputDTO as CreateTransactionUseCaseInputDTO } from "@/application/use-cases/transaction/create/input.dto";
import { CREATE_TRANSACTION_USE_CASE_TOKEN } from "@/infrastructure/frameworks/nestjs/modules/providers";

@Controller('transaction')
@UseGuards(JwtAuthGuard)
export class CreateTransactionController {
    constructor(
        @Inject(CREATE_TRANSACTION_USE_CASE_TOKEN)
        private readonly useCase: CreateTransactionUseCase
    ) {}

    @Post()
    public async handle(@Req() request: Request, @Res() res: Response) {
        const inputShape = z.object({
            amount: z.number({ error: "Valor é obrigatório e deve ser um número" }).min(0, { error: "Valor deve ser maior ou igual a zero" }),
            type: z.enum(['income', 'outcome'], { error: "Tipo deve ser 'income' ou 'outcome'" }),
            description: z.string({ error: "Descrição é obrigatória" }),
            executionDate: z.string({ error: "Data de execução é obrigatória" }).optional(),
            paymentTypeId: z.string({ error: "ID do tipo de pagamento é obrigatório" }),
            paymentCycleId: z.string({ error: "ID do ciclo de pagamento é obrigatório" }),
            times: z.number({ error: "Número de vezes é obrigatório" }).optional()
        });

        const input: CreateTransactionUseCaseInputDTO = {
            amount: Number(request.body.amount),
            type: request.body.type,
            description: request.body.description,
            executionDate: request.body.executionDate || undefined,
            paymentTypeId: request.body.paymentTypeId,
            times: request.body.times
        }

        const validated = inputShape.safeParse(input);

        if (!validated.success) {
            return res.status(400).json({ errors: validated.error });
        }

        this.useCase.exec(input)
            .then(result => res.json(result))
            .catch(error => {
                console.error(error);
                res.status(500).json({ error: error.message || 'Internal server error' });
            });
    }
}