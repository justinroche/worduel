import { useConnectionStore } from '../stores/connection'
import { server_host, server_port } from '../config/config.json'

export const checkServerConnection = async () => {
  const connectionStore = useConnectionStore()

  try {
    const response = await fetch(
      'http://' + server_host + ':' + server_port + '/health'
    )
    if (!response.ok) {
      throw new Error('Failed to connect')
    }
    connectionStore.setConnectionStatus(true)
  } catch (error) {
    connectionStore.setConnectionStatus(false)
  }
}
