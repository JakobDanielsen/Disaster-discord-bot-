const { Client, Intents, Message, MessageEmbed, User, MessageAttachment } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

let mention = message.mentions.user.first();

const prefix ="+";

// GAME VARIABLES
let bankBalances = {};
// GAME VARIABLES

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
        case"help":
            message.channel.send("+help");
        break;

        case"getTeamsMessages":
        break;


        // GAME SECTION //

        case"BitcoinBet":
        bitcoinBet();
        break;
        case"Balance":
        message.channel.send(`You have ${bankBalances[message.author.id]} BTC`)
        break;
    };
});
client.login("");

function bitcoinBet() {
    
    if (bankBalances[message.author.id] == null) {
        bankBalances[message.author.id] = 10;
        message.channel.send("You were given 10 BTC")
    } else { 
        message.channel.send("You have already recieved your startup money")
    }
    
    message.channel.send()
}