import { Intents, Client } from 'discord.js'
import { config as configEnv } from 'dotenv'
import firebaseUtils from './utils/firebaseUtils.js'
import log from './utils/logUtils.js'
import { parse as parseCmd } from 'discord-command-parser'

import onUserJoined from './resources/events/onUserJoined.js'
import verifier from './resources/verify/verifier.js'

// Configurable Variables
const prefix = '!poly' // Bot's Default prefix.

// Initialize Discord Client
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGES
  ]
})

// Configurate ENV files
configEnv()

// Connect Application to Firebase
firebaseUtils.init()

// On Message sent
client.on('messageCreate', (message) => {
  if (message.guild === null) {
    verifier(message)
    return
  }

  // Parse the command
  const parsed = parseCmd(message, prefix, { allowSpaceBeforeCommand: true })

  if (!parsed.success) return

  if (parsed.command == 'testDM') {
    // @ts-expect-error
    onUserJoined(message.member, message.guild)
  }
})

client.on('ready', () => {
  log.logSuccess('Bot', 'Successfully Connected to Discord!')
})

// Handle Errors without crashing process
process.on('unhandledRejection', (reason, p) => {
  console.log(p)
})

process.on('uncaughtException', err => {
  console.log(err, 'Uncaught Exception thrown')
})

log.logNormal('Bot', 'Loggin in...')
client.login(process.env.TOKEN)