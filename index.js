const discord = require('discord.js')
const phin = require('phin').defaults({parse: 'json'})
const config = require('./config.json')
const client = new discord.Client()

const prefix = config.prefix

const guildID = '905650109382004767'

const reactionChannels = [

]

const publishChannels = [
	''
]

const profileAPI = 'https://api.polytoria.com/v1/users/getbyusername?username='

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}`)

	setInterval(async () => {
		await client.user.setActivity(client.guilds.cache.reduce((a, guild) => a + guild.memberCount, 0).toLocaleString('en') + ' users', {type: 'WATCHING'})
	}, 60000)
})

client.on('guildMemberAdd', async (member) => {
	const emb = new discord.MessageEmbed()
		.setAuthor('Polytoria Verification', 'https://polytoria.com/assets/img/polytoria.png')
		.setTitle('Welcome to ' + member.guild.name + '!')
		.setDescription('Please verify your account on Polytoria to get access to all channels.\n\nTo verify your account, add this code to your [description](https://polytoria.com/my/settings):')
		.setColor(config.colors.info)

	await member.send(emb).catch(() => {})
	await member.send('```\n' + config['codePrefix'] + member.id + '\n```').catch(() => {})
	await member.send({
		embed: {
			color: config.colors.info,
			description: 'Once you\'re done, reply with **!poly done [username]** (without the square brackets)'
		}
	}).catch(() => {})
})

client.on('message', async (msg) => {
	if (msg.channel.type === 'dm') {
		if (msg.content === prefix + ' verify') {
			const emb = new discord.MessageEmbed()
				.setAuthor('Polytoria Verification', 'https://polytoria.com/assets/img/polytoria.png')
				.setDescription('Add this code to your [description](https://polytoria.com/my/settings):')
				.setColor(config.colors.info)

			await msg.channel.send(emb)
			await msg.channel.send('```css\n' + config['codePrefix'] + msg.author.id + '\n```')
			await msg.channel.send({
				embed: {
					color: config.colors.info,
					description: 'Once you\'re done, reply with **!poly done [username]** (without the square brackets)'
				}
			})
		} else if (msg.content.startsWith(prefix + ' done ')) {
			const username = msg.content.replace(prefix + ' done ', '')

			if (username) {
				const profile = await phin(profileAPI + username)

				if (profile.body.Description) {
					if (profile.body.Description.includes(config['codePrefix'] + msg.author.id)) {
						const emb = new discord.MessageEmbed()
							.setAuthor('Polytoria Verification', 'https://polytoria.com/assets/img/polytoria.png')
							.setDescription('You have been verified successfully. Happy talking!')
							.setThumbnail('https://polytoria.com/assets/thumbnails/avatars/' + profile.body.AvatarHash + '.png')
							.setColor(config.colors.success)
							.setTimestamp()

						await msg.channel.send(emb)
						await giveRoles(msg.author.id, profile.body, msg.channel)
					} else {
						const emb = new discord.MessageEmbed()
							.setAuthor('Error', 'https://polytoria.com/assets/img/error-circle.png')
							.setDescription('We couldn\'t find the code in your description. Please add the code to your description and try again.')
							.setColor(config.colors.error)
							.setTimestamp()

						await msg.channel.send(emb)
					}
				} else {
					const emb = new discord.MessageEmbed()
						.setAuthor('Error', 'https://polytoria.com/assets/img/error-circle.png')
						.setDescription('We could not find that user!')
						.setColor(config.colors.error)
						.setTimestamp()

					await msg.channel.send(emb)
				}
			} else {
				const emb = new discord.MessageEmbed()
					.setAuthor('Error', 'https://polytoria.com/assets/img/error-circle.png')
					.setDescription('Please enter your username.')
					.setColor(config.colors.error)
					.setTimestamp()

				await msg.channel.send(emb)
			}
		}
	} else {
		if (msg.guild.id === guildID) {
			if (msg.channel.type === 'text') {
				if (reactionChannels.includes(msg.channel.id)) {
					await msg.react('👍').catch(() => {})

					setTimeout(async () => {
						await msg.react('👎').catch(() => {})
					}, 1000)
				}
			} else if (msg.channel.type === 'news') {
				if (publishChannels.includes(msg.channel.id)) {
					await msg.crosspost().catch(() => {})
				}
			}
		}
	}
})

async function giveRoles(userID, req, channel) {
	const guild = client.guilds.cache.get(guildID)
	const verified = guild.roles.cache.find((role) => role.name === 'Verified')

	const member = await guild.members.fetch(userID)

	await member.roles.add(verified).catch(() => {})
	await member.setNickname(req.Username).catch(() => {})

	switch (req.MembershipType) {
		case 'PRO':
			const pro = guild.roles.cache.find((role) => role.name === 'Pro')
			await member.roles.add(pro).catch(() => {})

			break
		case 'PRO_UNLIMITED':
			const proUnlimited = guild.roles.cache.find((role) => role.name === 'Pro Ultimate')
			await member.roles.add(proUnlimited).catch(() => {})

			break
	}

	console.log('Verified ' + req.Username)
}

client.login(config.token)