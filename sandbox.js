const { Client, Intents, Message, MessageEmbed, User, MessageAttachment, Guild } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

let mention = message.mentions.user.first();

const prefix ="+";

// GAME VARIABLES
let bankBalances = {};
// GAME VARIABLES

client.once('ready', (message) =>{
    client.user.setPresence({ activities: [{ name: '+help', type: 'PLAYING' }], status: 'online' });


    //Når botten skrus på, finn en kanal kalt disaster, deretter send en melding der hvor boten pinger alle.
    if(client.channels.cache.find(channel => channel.name === 'disaster')){

    const channel = client.channels.cache.find(channel => channel.name === 'disaster')

    const id = channel ? channel.id : null;

    client.channels.cache.get(`${id}`).send("@everyone disaster is online!");

    } else{
        const channel = client.channels.cache.find(channel => channel.name === 'general')

        const id = channel ? channel.id : null;

        client.channels.cache.get(`${id}`).send("You need to create a channel for disaster bot-on messages called [disaster]");
    }
});

client.on("messageCreate", message =>{
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(" ");
    switch (args[0]){
        case"help":
            let embed = new MessageEmbed()
                    .setTitle(`Disaster bot`)
                    .addFields(
                        { name: 'game', value: `a small game! :partying_face:`},
                        { name: 'LOREM IPSUM', value: `DOLOR`},
                    )
                    .setColor("#0099ff")
                    .setAuthor("Helene,Jakob,Szymon")
                    .setTimestamp()
                message.channel.send({ embeds: [embed]});
        break;
        case"getTeamsMessages":
        break;



        // GAME SECTION //

        case"BitcoinBet":
        bitcoinBet();
        break;
        case"Balance":
        message.channel.send(`You have ${bankBalances[message.author.id]} BTC`)

        default:
            message.channel.send("this is not a valid command, to see all commands type +help");

        break;
    };
});
client.login("OTE1MTYyMDEyNTQ2MzcxNTk1.YaXlCg.vwU-Xpf9lvCLUxyE9QI0tgxNGzE");


function bitcoinBet() {
    
    if (bankBalances[message.author.id] == null) {
        bankBalances[message.author.id] = 10;
        message.channel.send("You were given 10 BTC")
    } else { 
        message.channel.send("You have already recieved your startup money")
    }
    
    message.channel.send()
}

