import { Message } from 'discord.js'
import firebaseUtils from '../../utils/firebaseUtils.js'
import onUserJoined from '../events/onUserJoined.js'

/**
 * Command Name
 */
export const name = 'verify'

/**
  * Command Description
  */
export const description = 'Get your Discord account verified!'

/**
  * Command main function
  */
export const main = async function (message: Message, args: string[]) {
  const isVerified = await firebaseUtils.isVerified(message.author.id)
  if (isVerified === true) {
    // @ts-expect-error
    const verifiedRoleConfig = await firebaseUtils.getSpecificServerConfig(message.guild.id, 'verifiedRole')
    if (verifiedRoleConfig) {
      // @ts-expect-error
      const role = message.guild.roles.cache.find(r => r.id === verifiedRoleConfig)

      // @ts-expect-error
      message.member.roles.add(role)

      message.channel.send('Successfully gave you verified role!')
      return
    }
    message.channel.send('Your Polytoria account has already been verified. To unlink use `!poly unverify`')
    return
  }
  // @ts-expect-error
  onUserJoined(message.member, message.guild)
}
