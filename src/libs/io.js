/**
 * @file Initializes + configures socket.io connections
 * @author William Duyck <fuzzyfox0@gmail.com>
 */

import io from 'socket.io-client'

const twitter = io(process.env.API_ROOT + '/tweet')
const slack = io(process.env.API_ROOT + '/slack')

export { io, twitter, slack }
