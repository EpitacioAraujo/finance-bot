interface InputDTO {
  commandText: string
}

export class DefineComandIntentionUseCase {
  constructor() {}

  public async execute(commandText: string): Promise<any> {
    const intent = await this.getIntentService().analyze(messageContent)

    if (intent.action === "register_entry") {
      const entryPayload = intent.entry

      if (!entryPayload) {
        throw new Error("register_entry action returned without entry payload")
      }

      const entryType: 1 | 0 = entryPayload.type === "income" ? 1 : 0

      const existingUser = await this.userRepository.findOne({
        where: { numberPhone: messageDetails.from },
      })

      const user =
        existingUser ??
        (await this.userRepository.save(
          this.userRepository.create({
            id: randomBytes(13).toString("hex"),
            username: messageDetails.from,
            numberPhone: messageDetails.from,
          })
        ))

      const entry = this.entryRepository.create({
        id: randomBytes(13).toString("hex"),
        date: new Date(),
        description: entryPayload.description,
        amount: entryPayload.value,
        type: entryType,
        userId: user.id,
        user,
      })

      await this.entryRepository.save(entry)

      await this.whatsAppMetaAPI.sendMessage(
        messageDetails.from,
        "Entrada registrada com sucesso!"
      )

      return
    }

    await this.whatsAppMetaAPI.sendMessage(
      messageDetails.from,
      "Desculpe, não conseguimos entender sua solicitação. Pode repetir por favor?"
    )
  }
}
