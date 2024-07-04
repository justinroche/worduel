import { socket } from './socketInstance'

let queue: Promise<void> = Promise.resolve()

export const enqueue = (task: () => Promise<void>) => {
  queue = queue.then(task).catch((error) => {
    console.error('Task failed:', error)
    queue = Promise.resolve() // Reset the queue to avoid blocking subsequent tasks
    throw error
  })
  return queue
}

export const emitAsync = (event: string, ...args: any[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    socket.emit(event, ...args, (error: any) => {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })
  })
}
