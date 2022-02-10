export class ElementNotFoundError extends Error {
  constructor(message: string) {
    super(`${message} is not found`) 
  }
}

export function assertHtmlElement<T extends HTMLElement>(elem: T|null|undefined, name: string): asserts elem is T {
  if(!elem) throw new ElementNotFoundError(name)
}