import io from 'socket.io-client'

const twitter = io(process.env.API_ROOT + '/tweet')

export { io, twitter }
