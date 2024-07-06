import { useConnectionStore } from '../stores/connection'

export const checkServerConnection = async () => {
  const connectionStore = useConnectionStore()

  try {
    const response = await fetch('http://localhost:8080/health')
    if (!response.ok) {
      throw new Error('Failed to connect')
    }
    connectionStore.setConnectionStatus(true)
  } catch (error) {
    connectionStore.setConnectionStatus(false)
  }
}
