const { Client, Intents, Message, MessageEmbed, User, MessageAttachment } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });


const prefix ="+";


client.once('ready', () =>{
    console.log("Conceive bot er online!")
});

client.on("messageCreate", message =>{
    
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(" ");
    switch (args[0]){
        case"help":
            let embed = new MessageEmbed()
                    .setTitle(`The help has arrived!`)
                    .addFields(
                        { name: 'LOREM IPSUM', value: `DOLOR`},
                        { name: 'LOREM IPSUM', value: `DOLOR`},
                    )
                    .setColor("#0099ff")
                    .setAuthor("Helene,Jakob,Szymon")
                    .setTimestamp()
                message.channel.send({ embeds: [embed]});
        break;
        case"getTeamsMessages":
    };
});
client.login("");