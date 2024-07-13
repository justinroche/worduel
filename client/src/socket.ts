import { io } from 'socket.io-client'
import { server_host, server_port } from './config.json'

const socket = io('http://' + server_host + ':' + server_port)

export default socket
