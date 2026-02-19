import { JwtAuthGuard } from "@/infrastructure/frameworks/nestjs/guards/jwt-auth.guard";
import { Controller, Inject, Post, Req, Res, UseGuards } from "@nestjs/common";
import type { Request, Response } from "express";
import { InputDTO } from "./input.dto";
import { validate } from "class-validator";
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
        const input = {
            amount: Number(request.body.amount),
            type: request.body.type,
            description: request.body.description,
            executionDate: request.body.executionDate || undefined,
            paymentTypeId: request.body.paymentTypeId,
            paymentCycleId: request.body.paymentCycleId,
            times: request.body.times
        } as CreateTransactionUseCaseInputDTO

        const validated = await validate(new InputDTO(input as any));

        if (validated.length > 0) {
            return res.status(400).json({ errors: validated });
        }

        this.useCase.exec(input)
            .then(result => res.json(result))
            .catch(error => {
                console.error(error);
                res.status(500).json({ error: error.message || 'Internal server error' });
            });
    }
}