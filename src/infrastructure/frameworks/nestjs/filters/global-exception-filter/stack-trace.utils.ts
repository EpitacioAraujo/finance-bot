/**
 * Utilitários para extração de informações do stack trace
 */

/**
 * Extrai o arquivo, linha e coluna onde o erro ocorreu do stack trace
 */
export function extractErrorLocation(stack?: string): string | undefined {
  if (!stack) return undefined;

  // Procura pela primeira linha do stack que não seja a própria classe de erro
  const stackLines = stack.split('\n');
  for (let i = 1; i < stackLines.length; i++) {
    const line = stackLines[i].trim();
    // Regex para capturar arquivo:linha:coluna
    const match =
      line.match(/\((.+):(\d+):(\d+)\)/) || line.match(/at (.+):(\d+):(\d+)/);
    if (match) {
      return `${match[1]}:${match[2]}:${match[3]}`;
    }
  }

  return undefined;
}

/**
 * Extrai propriedades customizadas do erro (além das padrão)
 */
export function extractErrorProperties(
  error: Error,
): Record<string, any> | undefined {
  const standardProps = ['name', 'message', 'stack', 'cause'];
  const customProps: Record<string, any> = {};

  // Propriedades próprias do objeto
  for (const key of Object.keys(error)) {
    if (!standardProps.includes(key)) {
      customProps[key] = (error as any)[key];
    }
  }

  // Propriedades do prototype que não sejam funções
  const proto = Object.getPrototypeOf(error);
  if (proto && proto !== Error.prototype) {
    for (const key of Object.getOwnPropertyNames(proto)) {
      if (
        key !== 'constructor' &&
        typeof proto[key] !== 'function' &&
        !standardProps.includes(key)
      ) {
        customProps[key] = (error as any)[key];
      }
    }
  }

  return Object.keys(customProps).length > 0 ? customProps : undefined;
}
