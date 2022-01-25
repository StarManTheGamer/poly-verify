import { Message } from 'discord.js'
import firebaseUtils from '../../utils/firebaseUtils.js'

/**
 * Command Name
 */
export const name = 'bind'

/**
  * Command Description
  */
export const description = 'Configurate How the bot will works!'

/**
  * Command main function
  */
export const main = async function (message: Message, args: string[]) {
  if (!args[0]) {
    const messageEmbedContent =
        {
          title: 'Bind command',
          description: 'It looks like you\'re using wrong format! Here\'s tutorial on how it works!\n```!poly bind [config_name] [value]```\n**Available Settings**\n\n`verifiedRole` Set the role that will be given to verified users. Value should be mentioned role',
          color: 0x66ff91
        }

    return message.channel.send({ embeds: [messageEmbedContent] })
  }

  if (args[0] === 'verifiedRole') {
    if (!message.mentions.roles.first()) {
      message.channel.send('Invaild type: Value should be mentioned role!')
    } else {
      firebaseUtils.configServer(
        // @ts-expect-error
        message.guild.id,
        args[0],
        // @ts-expect-error
        message.mentions.roles.first().id
      )
      message.channel.send('🎉 Succesfully Binded Verified role!')
    }
  }
}
