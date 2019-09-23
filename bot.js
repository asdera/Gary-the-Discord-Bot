var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const request = require('request');
const cheerio = require('cheerio');

// Imports the Google Cloud client library
const language = require('@google-cloud/language');

// Creates a client
const client = new language.LanguageServiceClient();

var privateChannel = "341317901330153482";
var admin = "220283093804646400";

var pomodoroStart;
var pomodoro;
const gifApikey = auth.gifApikey;
const searchApikey = auth.searchApikey;


var relaxMessages = ["Easy there partner, enjoy a short little break.", 
    "Catch your breath and take it easy, you got some time to relax.", 
    "You've been grinding hard, take a chill pill.", 
    "Good work so far, take a breather mate.", 
    "Grab a cup of coffee, don't overdo yourself.", 
    "Your eyes seem weary, talk a little walk and enjoy the view.",
    "Stretch it out a bit, you don't want any back problems.",
    "You look exhausted, loosen up a bit and make sure to stay hydrated."
];



var workMessages = ["Stop beating about the bush! Time's a wastin'!", 
    "There are jobs waiting to be done! Get the show on the road!", 
    "Get down to business! We ain't got all day!", 
    "No more time to relax! Fire away!", 
    "Buckle down! It's time to focus again!", 
    "Started working! You've sat around for too long!",
    "You can't dawdle for any longer! Finish your tasks!",
    "Success takes effort! You've had your breaks!"
];

var workGif = ["work", "get to work", "grind", "go go go", "keep going", "workout", "work harder", "time to work"];

var relaxGif = ["relax", "chill", "take a break", "lie down", "rest", "calm down", "relaxing", "chilling"];

var allMessages = [[], workMessages, relaxMessages, workGif, relaxGif];

var eavesdrop = false;



// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});


bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');

    bot.setPresence({ game: { name: "Hello World", type: 0 } });
});

bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    
    if (message.substring(0, 1) == '!') {
        // logger.info(channelID);

        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd.toLowerCase()) {
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
            break;
            case 'fact':
                text = args.join(" ");

                getWiki(channelID, text);                  

            break;
            case 'search':
                search = args.join(" ");

                getSearch(channelID, search, num);                 

            break;
            case 'g':
                text = args.join(" ");

                getEntity(channelID, text);                 

            break;
            case 'gif':

                var num;

                args.forEach(element => {
                    if (element.substring(0, 1) == '-' && /\d/.test(element)) {
                        num = Math.abs(parseInt(element));
                    }
                });

                args = args.filter(function(element, index, arr){
                    return element.substring(0, 1) != '-';
                });

                search = args.join(" ");

                getGif(channelID, search, num);                 

            break;
            case 'pomodoro':
                if (pomodoro) {
                    // clearTimeout(pomodoroStart);
                    clearInterval(pomodoro);
                    pomodoro = null;
                    bot.sendMessage({
                        to: channelID,
                        message: '```The Tomato Timer is OVER!```'
                    });
                    bot.setPresence({ game: { name: "Hello World", type: 0 } });
                } else {
                    bot.sendMessage({
                        to: channelID,
                        message: '```The Tomato Timer has been ACTIVATED!```',
                    });
                    
                    var currentTime = new Date(); // for now
                    var hours = currentTime.getHours();
                    var minutes = currentTime.getMinutes();
                    var seconds = currentTime.getSeconds();
                    var message = 0;
                    if (minutes < 25) {
                        message = 1;
                        bot.setPresence({ game: { name: "Work Period", type: 0 } });
                    } else if (minutes < 30) {
                        message = 2;
                        bot.setPresence({ game: { name: "Break Period", type: 0 } });
                    } else if (minutes < 50) {
                        message = 1;
                        bot.setPresence({ game: { name: "Work Period", type: 0 } });
                    } else {
                        message = 2;
                        bot.setPresence({ game: { name: "Break Period", type: 0 } });
                    } 

                    // console.log(hours, minutes, seconds, channelID);
                    if (message) {
                        bot.sendMessage({
                            to: channelID,
                            message: ["**BREAK PERIOD**", "**WORK PERIOD**"][message%2] + "\n" + allMessages[message].random(),
                        });

                        setTimeout(async () => { 
                            getGif(channelID, allMessages[message+2].random())
                        }, 6000);
                    }

                    pomodoro = setInterval(async function () {
                        var currentTime = new Date(); // for now
                        var hours = currentTime.getHours();
                        var minutes = currentTime.getMinutes();
                        var seconds = currentTime.getSeconds();
                        var message = 0;
                        if (minutes == 0) {
                            message = 1;
                            bot.setPresence({ game: { name: "Work Period", type: 0 } });
                        } else if (minutes == 25) {
                            message = 2;
                            bot.setPresence({ game: { name: "Break Period", type: 0 } });
                        } else if (minutes == 30) {
                            message = 1;
                            bot.setPresence({ game: { name: "Work Period", type: 0 } });
                        } else if (minutes == 50) {
                            message = 2;
                            bot.setPresence({ game: { name: "Break Period", type: 0 } });
                        } else {
                            // console.log(hours, minutes, seconds);
                        }

                        // console.log(hours, minutes, seconds, channelID);
                        if (message) {
                            bot.sendMessage({
                                to: channelID,
                                message: ["**BREAK PERIOD**", "**WORK PERIOD**"][message%2] + "\n" + allMessages[message].random(),
                            });

                            setTimeout(async () => { 
                                getGif(channelID, allMessages[message+2].random())
                            }, 6000);
                        }
                        
                    }, 60000);
                    // }, reset)
                }

            break;
            
        }
     }
});

async function getSearch(channelID, search) {

    var xhrString = "https://www.googleapis.com/customsearch/v1?key=" + searchApikey + "&cx=001673406622418809124:t3utvrlqfcb&q=" + search.replace(/ /g,"+");

    var request = new XMLHttpRequest(xhrString);

    request.open('GET', xhrString, true);

    request.onload = function() {
        if (this.status >= 200 && this.status < 400) {
            // Success!
            var data = JSON.parse(this.responseText);
            // console.log("Success got data", data);
            
            console.log(data);
            console.log("XXXXXXXXXXXXXXXX");
            console.log(data.items[0].pagemap);

        } else {
            console.log("Error");
        }
    };

    request.onerror = function() {
        console.log("No connection");
    };

    request.send();
}

async function getWiki(channelID, text, force=true) {
    request('https://en.wikipedia.org/wiki/' + text, (error, response, html) => {
    if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);

        var facts = [];

        $('.mw-parser-output > p').each((i, el) => {
            // console.log("\n\n\n");
            // console.log(i, $(el).text());
            facts.push($(el).text());
        });

        console.log('Scraping Done...');

        facts = facts.map(fact => cleanFact(fact)).filter(Boolean);

        var fact = facts.random();

        if (facts.length == 0) {
            bot.sendMessage({
                to: channelID,
                message: "**No Fun Facts Found D:**"
            });
        } else if (fact.slice(-1) == ":") {
            var refers = [];

            $('.mw-parser-output > ul > li > a').each((i, el) => {
                console.log("\n\n\n");
                console.log(i, $(el).attr('href'));
                refers.push($(el).attr('href').substring(6));
            });

            refer = refers.random();

            bot.sendMessage({
                to: channelID,
                message: fact.slice(0, -1) + " **" + refer.replace(/_/g, ' ') + "**"
            });

            if (force) {
                setTimeout(async () => { 
                    getWiki(channelID, refer);
                }, 2000);
            }
        } else {
            bot.sendMessage({
                to: channelID,
                message: "**Fun Fact: **" + fact
            });
        }
    } else {
        console.log(error + response.statusCode);
        bot.sendMessage({
            to: channelID,
            message: "**No Fun Facts Found D:**"
        });
    }
    });
}

async function getEntity(channelID, text) {
    /**
     * TODO(developer): Uncomment the following line to run this code.
     */
    // const text = 'Your text to analyze, e.g. Hello, world!';

    // Prepares a document, representing the provided text
    const document = {
        content: text,
        type: 'PLAIN_TEXT',
    };

    // Detects entities in the document
    const [result] = await client.analyzeEntities({document});

    const entities = result.entities;

    console.log('Entities:');
    entities.forEach(entity => {
        console.log(entity.name);
        console.log(` - Type: ${entity.type}, Salience: ${entity.salience}`);
        if (entity.metadata && entity.metadata.wikipedia_url) {
            console.log(` - Wikipedia URL: ${entity.metadata.wikipedia_url}$`);
        }
    });
}

async function getGif(channelID, search, num, limit=8) {

    var xhrString = "http://api.giphy.com/v1/gifs/search?q=" + search.replace(/ /g,"+") + "&api_key=" + gifApikey + "&limit=" + limit;

    var request = new XMLHttpRequest(xhrString);
    
    if (num == null) {
        num = Math.floor(Math.random()*limit);
    }

    request.open('GET', xhrString, true);

    request.onload = function() {
        if (this.status >= 200 && this.status < 400) {
            // Success!
            var data = JSON.parse(this.responseText).data;
            // console.log("Success got data", data);
            
            gifs = data.map(x => x.bitly_url);

            if (data.length == 0) {
                bot.sendMessage({
                    to: channelID,
                    message: "No results for gifs!"
                });
            } else {
                bot.sendMessage({
                    to: channelID,
                    message: gifs[num % gifs.length]
                });
            }
        } else {
            console.log("Error");
        }
    };

    request.onerror = function() {
        console.log("No connection");
    };

    request.send();
}


Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}

Array.prototype.random = function () {
    return this[Math.floor((Math.random()*this.length))];
}

async function remind() {
    bot.sendMessage({
        to: privateChannel,
        message: "<@"+admin+"> "+hours+":"+minutes.pad()
    });
}

function cleanFact(fact) {
    return fact.replace(/ *\([^)]*\) */g, "").replace(/ *\[[^)]*\] */g, "").replace(/ *\{[^)]*\} */g, "").replace(/\s+/g, ' ').trim();
}
