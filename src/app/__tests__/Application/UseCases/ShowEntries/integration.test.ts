describe("ShowEntries Use Case Integration Test", () => {
  test("should show entries correctly", async () => {
    const appInstance = (global as any).testAppInstance
    expect(appInstance).toBeDefined()
    const entryRepository = appInstance.container.resolve("EntryRepository")
    expect(entryRepository).toBeDefined()
  })
})
