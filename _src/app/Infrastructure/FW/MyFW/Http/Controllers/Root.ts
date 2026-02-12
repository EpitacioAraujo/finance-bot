import { injectable, inject } from "tsyringe"
import { ProcessCommandUseCase } from "@app/Application/UseCases/ProcessComand"
import { type Request, type Response } from "express"

@injectable()
export class RootController {
  constructor(
    @inject(ProcessCommandUseCase)
    private processCommandUseCase: ProcessCommandUseCase
  ) {}

  async handle(_: Request, res: Response): Promise<any> {
    const result = await this.processCommandUseCase.execute({} as any)
    return res.send(result)
  }
}
