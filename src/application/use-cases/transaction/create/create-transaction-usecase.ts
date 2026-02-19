import { BusinessError } from "@/domain/errors/BusinessError";
import { InputDTO } from "./input.dto";
import { PaymentTypeRepository } from "@/domain/ports/repositories/PaymentTypeRepository";
import { PaymentCycleRepository } from "@/domain/ports/repositories/PaymentCycleRepository";
import { TransactionRepository } from "@/domain/ports/repositories/TransactionRepository";
import { PaymentCycle } from "@/domain/entities/business/PaymentCycle";
import { addMonths } from "date-fns";
import { Transaction } from "@/domain/entities/business/Transaction";

export class CreateTransactionUseCase {
    constructor(
        private paymentTypeRepository: PaymentTypeRepository,
        private paymentTypeCycleRepository: PaymentCycleRepository,
        private transactionRepository: TransactionRepository
    ) {}

    async exec(payload: InputDTO): Promise<{ok: boolean}> {
        const paymentType = await this.paymentTypeRepository.get(payload.paymentTypeId);

        if (!paymentType) {
            throw new BusinessError('Payment type not found');
        }

        const executionDate = payload.executionDate || new Date();

        const times = payload.times || 1;

        const paymentCycles = this.paymentTypeCycleRepository.search({
            paymentTypeId: payload.paymentTypeId,
            startDate: executionDate,
            endDate: addMonths(executionDate, 1)
        });

        const newPaymentCycles: PaymentCycle[] = [];
        const newTransactions: Transaction[] = []

        let startDate = executionDate;
        let endDate = addMonths(executionDate, 1);

        for (let i = 0; i < times; i++) {
            startDate = addMonths(startDate, 1 * times)
            endDate = addMonths(startDate, 1)

            if(!paymentCycles[i]) {
                newPaymentCycles[i] = new PaymentCycle({
                    paymentTypeId: payload.paymentTypeId,
                    start_date: startDate,
                    end_date: endDate,
                })
            }

            const paymentCicle: PaymentCycle = paymentCycles[i] || newPaymentCycles[i];

            newTransactions.push(new Transaction({
                amount: payload.amount,
                type: payload.type,
                description: payload.description,
                executionDate: executionDate,
                paymentTypeId: paymentType.id,
                paymentCycleId: paymentCicle.id
            }))
        }

        await Promise.all(newPaymentCycles.map(this.paymentTypeCycleRepository.store));
        await Promise.all(newTransactions.map(this.transactionRepository.store));

        return { ok: true }
    }
}