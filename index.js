
const { Client, GatewayIntentBits, ChannelType, PermissionsBitField } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log(`تم تشغيل البوت: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (message.content !== '!إنشاء') return;
  if (!message.guild) return;

  if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
    return message.reply('ليس لديك صلاحية إنشاء السيرفر!');
  }

  await message.reply('⏳ جاري تجهيز أقسام السيرفر...');

  const sections = [
    {
      name: '📢・الإعلانات',
      channels: ['ترحيب', 'توديع', 'القوانين', 'أخبار-السيرفر']
    },
    {
      name: '💬・المجتمع',
      channels: ['شات-عام', 'ستريك', 'بوستات']
    },
    {
      name: '🎮・الألعاب',
      channels: ['أوامر', 'مسابقات', 'فعاليات']
    },
    {
      name: '🎫・الدعم الفني',
      channels: ['فتح-تذكرة']
    }
  ];

  try {
    for (const section of sections) {
      let category = message.guild.channels.cache.find(
        c => c.name === section.name && c.type === ChannelType.GuildCategory
      );

      if (!category) {
        category = await message.guild.channels.create({
          name: section.name,
          type: ChannelType.GuildCategory
        });
      }

      for (const channelName of section.channels) {
        const exists = message.guild.channels.cache.find(
          c => c.name === channelName && c.parentId === category.id
        );

        if (!exists) {
          await message.guild.channels.create({
            name: channelName,
            type: ChannelType.GuildText,
            parent: category.id
          });
        }
      }
    }

    await message.channel.send('✅ تم إنشاء أقسام ورومات السيرفر بنجاح!');
  } catch (error) {
    console.error(error);
    await message.channel.send('❌ حدث خطأ أثناء إنشاء الرومات.');
  }
});

client.login(process.env.DISCORD_TOKEN);
