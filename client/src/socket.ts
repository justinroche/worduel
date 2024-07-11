import { io } from 'socket.io-client'

const socket = io('http://192.168.7.33:8080')

export default socket
