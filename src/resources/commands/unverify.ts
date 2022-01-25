import { Message } from 'discord.js'
import firebaseUtils from '../../utils/firebaseUtils.js'

/**
 * Command Name
 */
export const name = 'unVerify'

/**
  * Command Description
  */
export const description = 'Unlink your Polytoria account with discord.'

/**
  * Command main function
  */
export const main = async function (message: Message, args: string[]) {
  const isVerified = await firebaseUtils.isVerified(message.author.id)
  if (isVerified === false) {
    message.channel.send("Your Polytoria account haven't been verified yet. To verify use `!poly verify`")
    return
  }
  await firebaseUtils.unLinkAccount(message.author.id)
  message.channel.send('Your Polytoria account has been unlinked.')
}
