const { Client, Intents, Message, MessageEmbed, User, MessageAttachment, Guild } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
//importer json fil for å skjule token så det ikke blir resatt hver gang vi pusher botten til main
let config = require('./config.json');

let userselectedcrypto = {};

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


    function selectcrypto(){
        if(!args[1]){
            message.channel.send("syntax: +selectCrypto [crypto]");
        }else{
            args[1].toUpperCase();
            userselectedcrypto[message.author.id] = args[1];
            message.channel.send(`you have selected ${userselectedcrypto[message.author.id]} as your form of cryptocurrency`);
        }
    };

    function getBitcoin() {
    
        if (bankBalances[message.author.id] == null ) {
            bankBalances[message.author.id] = 10;
            message.channel.send("You were given 10: " + userselectedcrypto[message.author.id]);
        } else { 
            message.channel.send("You have already recieved your startup money")
        }
    }
    function flip(){
        let flipnum = Math.round(Math.random());
        switch(flipnum){
            case 0:
                message.channel.send("you flipped heads");
            break;
            case 1: 
            message.channel.send("you flipped tails");
            break;
        }
    };
    function bet() {
        if (args[1] > bankBalances[message.author.id] || args[1] == null) {
            message.channel.send("You must have the amount of money you bet")
        } else if (3 == Math.round(Math.random()*3)) {
            bankBalances[message.author.id] += args[1]*3;
            message.channel.send(`You Won! New balance is ${bankBalances[message.author.id]} ${userselectedcrypto[message.author.id]} `)
        } else {
            bankBalances[message.author.id] -= args[1];
            message.channel.send(`Better luck next time! New balance is ${bankBalances[message.author.id]} ${userselectedcrypto[message.author.id]} `)
        }
    }

    // lånt fra nettet :)
    function thousandsSeparators(num) {
        let num_parts = num.toString().split(".");
        num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return num_parts.join(".");
    }
    

    //let mention = message.mentions.user.first();
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(" ");
    switch (args[0]){
        case"help":
        case"Help":
            let embed = new MessageEmbed()
                    .setTitle(`Disaster bot`)
                    .addFields(
                        { name: 'selectcrypto', value: `select your cryptocurrency :sunglasses:`},
                        { name: 'getcrypto', value: `get the crypto for your game :partying_face:`},
                        { name: 'bet', value: `Bet some crypto!!`},
                        { name: 'bal', value: `shows you your crypto balance :moneybag:`},
                    )
                    .setColor("#0099ff")
                    .setAuthor("Helene,Jakob,Szymon")
                    .setTimestamp()
                message.channel.send({ embeds: [embed]});
        break;
        case "getTeamsMessages":
        break;

        // GAME SECTION //
        case"selectcrypto":
            selectcrypto();
        break;

        case "getcrypto":
        case "Getcrypto":
        case "get":
        getBitcoin();
        break;
        
        case "bet":
              bet();
        break;
        case "bal": 
        case"Balance": 
        case "balance":
        message.channel.send(`You have ${bankBalances[message.author.id]} ${userselectedcrypto[message.author.id]} `);
        break;
        case"value":
                async function fetch(){
                const fetch = require("node-fetch");
                let data = await fetch(`http://api.coinlayer.com/api/live?access_key=223df91f83bcba306ce587bce6cc0fd8`).then(res =>
                res.json()) .catch(console.error())
                let userdata = data.rates[userselectedcrypto[message.author.id]];
                let btcvalue = Math.round(bankBalances[message.author.id] * userdata );
                let embed1 = new MessageEmbed()
                    .addFields(
                        {name:`Your ${userselectedcrypto[message.author.id]} : `, value: `${thousandsSeparators(bankBalances[message.author.id])}`},
                        {name: "USD equivalent: ", value: `${thousandsSeparators(btcvalue)} $`}
                    )
                    .setColor("#0099ff")
                    .setTimestamp()
                message.channel.send({ embeds: [embed1]});
                };
                fetch();
        break;
        case "flip":
            flip();
        break;
        case "subreddit":
            if(!args[1]){
                message.channel.send("Syntax: +subreddit [subreddit]");
            }else{
                async function fetchReddit(){
                const fetch = require("node-fetch");
                let data = await fetch(`http://meme-api.herokuapp.com/gimme/${args[1]}`).then(res =>
                res.json()) .catch(console.error())
                let embed1 = new MessageEmbed()
                    .setTitle(`here is a post from ${args[1]}`)
                    .setURL(data.postLink)
                    .setColor("#0099ff")
                    .setFooter(data.ups + " Upvotes")
                    .setTimestamp()
                    .setImage(data.url)
                message.channel.send({ embeds: [embed1]});
                };
                fetchReddit();
            };
        break;
        default:
            message.channel.send("this is not a valid command, to see all commands type +help");
        break; 
    };
});
client.login(config.token);




