import { socket } from './socketInstance'

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
