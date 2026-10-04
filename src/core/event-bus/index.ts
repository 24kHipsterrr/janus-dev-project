// © Janus — yashxsanjay
type Handler<T = unknown> = (payload: T) => void

class EventBus {
  private readonly handlers = new Map<string, Handler[]>()

  emit<T>(event: string, payload?: T): void {
    this.handlers.get(event)?.forEach((h) => (h as Handler<T>)(payload as T))
  }

  on<T>(event: string, handler: Handler<T>): () => void {
    const list = this.handlers.get(event) ?? []
    list.push(handler as Handler)
    this.handlers.set(event, list)
    return () => this.off(event, handler as Handler)
  }

  off(event: string, handler: Handler): void {
    const list = this.handlers.get(event)
    if (!list) return
    this.handlers.set(
      event,
      list.filter((h) => h !== handler)
    )
  }
}

export const eventBus = new EventBus()
