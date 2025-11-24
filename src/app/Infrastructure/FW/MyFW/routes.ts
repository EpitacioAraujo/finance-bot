import { type Express, type Request, type Response } from 'express';
import { TSyringer } from './Config/TSyringer';

import { WhatsAppWebHookValidation } from "@app/Infrastructure/FW/MyFW/Http/WebHooks/MetaAPI/WhatsAppWebHookValidation";
import { WhatsappMessageReciveController } from "@app/Infrastructure/FW/MyFW/Http/WebHooks/MetaAPI/WhatsappMessageReciveController";
import { RootController } from "./Http/Controllers/Root";

export class Routes {
    constructor(
        private app: Express,
        private container: TSyringer
    ) { }

    async loader() {
        this.app.get("/", this.resolveController(RootController, "handle"));
        this.app.get("/whatsapp", WhatsAppWebHookValidation);
        this.app.post(
            "/whatsapp",
            this.resolveController(WhatsappMessageReciveController, "handle")
        );
        this.app.get("/dash/:phoneNumber", async (_req, _res) => {
            // const phoneNumber = req.params.phoneNumber;
            // const tipo = String(req.query["tipo"] ?? "todos");
            // const ordenar = String(req.query["ordenar"] ?? "data");
            // const ordem = String(req.query["ordem"] ?? "desc");
            // const user = await userRepository.findOne({
            //   where: { numberPhone: phoneNumber },
            // });
            // if (!user) {
            //   res
            //     .status(404)
            //     .send(
            //       `<h1>Usuário não encontrado</h1><p>Nenhum usuário cadastrado com o número ${phoneNumber}.</p>`
            //     );
            //   return;
            // }
            // const loadDashBoardUseCase = new LoadDashBoardUseCase(entryRepository);
            // const html = await loadDashBoardUseCase.execute({
            //   user,
            //   ordenar,
            //   ordem,
            //   tipo,
            // });
            // res.send(html);
        });
    }

    resolveController<T>(
        controllerClass: new (...args: any[]) => T,
        method: keyof T
    ): (req: Request, res: Response) => any {
        return (req: Request, res: Response) => {
            const controller = this.container.resolve(controllerClass);
            const handler = controller[method] as any;
            return handler.call(controller, req, res);
        };
    }
}