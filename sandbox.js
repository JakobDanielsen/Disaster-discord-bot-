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
            message.channel.send("+help");
        break;
    };
});

client.login("OTE1MTYyMDEyNTQ2MzcxNTk1.YaXlCg.MvfeSSVmLdd0cKkR8Bx9As2v3zo")
