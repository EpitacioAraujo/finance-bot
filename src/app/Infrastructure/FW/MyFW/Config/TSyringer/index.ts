import { container, DependencyContainer, InjectionToken } from "tsyringe";
import { bootstrapContainer } from "./bootstrap";

export class TSyringer {
  private container!: DependencyContainer;

  constructor() {
    this.container = container;
  }

  public resolve<T>(token: InjectionToken<T>): T {
    return this.container.resolve<T>(token);
  }

  public async bootstrap() {
    await bootstrapContainer(this.container);
  }
}
