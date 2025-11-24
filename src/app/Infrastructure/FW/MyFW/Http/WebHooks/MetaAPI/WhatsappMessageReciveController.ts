import "reflect-metadata";
import { injectable } from "tsyringe";
import { Request, Response } from "express";

import { ProcessCommandUseCase } from "@app/Application/UseCases/ProcessComand";

import { MessageMapper } from "@app/Infrastructure/ServiceProviders/WhatsApp/MetaService/Services/MessageMapper";

@injectable()
export class WhatsappMessageReciveController {
  constructor(private readonly useCase: ProcessCommandUseCase) {}

  public async handle(req: Request, res: Response): Promise<void> {
    try {
      res.status(200).send("OK");

      const commandMessage = await new MessageMapper().execute(req.body);

      await this.useCase.execute({ commandMessage });
    } catch (error) {
      console.error("Error processing WhatsApp message:", error);
    }
  }
}
