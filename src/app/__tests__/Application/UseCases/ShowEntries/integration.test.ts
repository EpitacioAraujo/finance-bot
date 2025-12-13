import {
  ProcessCommandUseCase,
  InputDTO as ProcessCommandUseCaseInputDTO,
} from "@app/Application/UseCases/ProcessComand"
import { AIProviderPort } from "@app/Domain/Ports/Providers/AIProvider"

describe("ShowEntries Use Case Integration Test", () => {
  test("should show entries correctly", async () => {
    const appInstance = global.testAppInstance!
    let aIProviderPort =
      appInstance.container.resolve<AIProviderPort>(typeof AIProviderPort)

    const useCase = new ProcessCommandUseCase(aIProviderPort)

    // Arrange
    const input: ProcessCommandUseCaseInputDTO = {
      commandMessage: {
        audioPath: null,
        content: "Comprei um açai por 5,50 no cartão de crédito",
        contentType: "text",
        from: "+5588997761060",
        id: "1000",
        "meta-data": {},
      },
    }

    // Act
    await useCase.execute(input)
  })
})
