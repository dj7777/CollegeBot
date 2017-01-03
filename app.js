var botBuilder = require('botbuilder');
var restify = require('restify');
var siteUrl = require('./site-url');
// Setup restify server

var server = restify.createServer();   
server.listen(process.env.port || process.env.PORT || 3978, function(){
    console.log('%s listening to %s', server.name, server.url);
});

// create the connector

var connector = new botBuilder.ChatConnector();

var bot = new botBuilder.UniversalBot(connector, { persistUserData: true });

 server.post('/api/messages', connector.listen());

// Fees, Events, Assignments,Notice

// Welcome Dialog

const MainOptions = {
    Events: 'Events',
    Fees: 'Fees',
    Assignments: 'Assignments',
    Notice : 'Notice'
};

bot.dialog('/', (session) => {
    if(session.message.text.trim().toUpperCase() === MainOptions.Events.toUpperCase()) {
        // Order Flowers
        return session.beginDialog('/events');
    }

    var welcomeCard = new botBuilder.HeroCard(session)
        .title('Welcome to GGITS')
        .subtitle('Select any of the below options to get started')
        .images([
            new botBuilder.CardImage(session)
                .url('https://placeholdit.imgix.net/~text?txtsize=56&txt=Contoso%20Flowers&w=640&h=330')
                .alt('Contoso Flowers')
        ])
        .buttons([
            botBuilder.CardAction.imBack(session, MainOptions.Events, MainOptions.Events),
            botBuilder.CardAction.imBack(session, MainOptions.Fees, MainOptions.Fees),
            botBuilder.CardAction.imBack(session, MainOptions.Assignments, MainOptions.Assignments),
            botBuilder.CardAction.imBack(session, MainOptions.Notice, MainOptions.Notice)
        ]);

    session.send(new botBuilder.Message(session)
        .addAttachment(welcomeCard));
});


//bot.library(require('./dialogs/events'));
//bot.library(require('./dialogs/fees'));
//bot.library(require('./dialogs/assignments'));
//bot.library(require('./dialogs/notice'));

const feesRegex = /^fees/i;
const noticeRegex = new RegExp('^(' + MainOptions.Notice + '|notice)', 'i');
bot.use({
    botbuilder: (session, next) => {
        var text = session.message.text;
        if (feesRegex.test(text)) {
            // interrupt and trigger 'settings' dialog 
            return session.beginDialog('/fees');
        } else if (noticeRegex.test(text)) {
            // interrupt and trigger 'help' dialog
            return session.beginDialog('/notice');
        }   

        // continue normal flow
        next();
    }
});


bot.on('conversationUpdate', (message) => {
    if (message.membersAdded) {
        message.membersAdded.forEach((identity) => {
            if (identity.id === message.address.bot.id) {
                bot.beginDialog(message.address, '/');
            }
        });
    }
});

bot.dialog('/events', 
    function(session, args, next){       

const EventOptions = {
    Technical: 'Technical',
    Cultural: 'Cultural',
    };

  
    var eventCard = new botBuilder.HeroCard(session)
        .title('Welcome to GGITS Events')
        .subtitle('Select any of the below Event Types!!')
        .images([
            new botBuilder.CardImage(session)
                .url('https://placeholdit.imgix.net/~text?txtsize=56&txt=Contoso%20Flowers&w=640&h=330')
                .alt('Contoso Flowers')
        ])
        .buttons([
            botBuilder.CardAction.imBack(session, EventOptions.Events, MainOptions.Events),
            botBuilder.CardAction.imBack(session, EventOptions.Fees, MainOptions.Fees),
            botBuilder.CardAction.imBack(session, EventOptions.Assignments, MainOptions.Assignments),
            botBuilder.CardAction.imBack(session, EventOptions.Notice, MainOptions.Notice)
        ]);

    session.send(new botBuilder.Message(session)
        .addAttachment(eventCard));


           // botBuilder.Prompts.text(session, "What's your name?");
        
       
    });
bot.dialog('/fees', 
    function(session, args, next){       

const EventOptions = {
    Technical: 'Technical',
    Cultural: 'Cultural',
    };

  
    var eventCard = new botBuilder.HeroCard(session)
        .title('Welcome to GGITS Fees')
        .subtitle('Fees Options!!')
        .images([
            new botBuilder.CardImage(session)
                .url('https://placeholdit.imgix.net/~text?txtsize=56&txt=Contoso%20Flowers&w=640&h=330')
                .alt('Contoso Flowers')
        ])
        .buttons([
            botBuilder.CardAction.imBack(session, EventOptions.Events, MainOptions.Events),
            botBuilder.CardAction.imBack(session, EventOptions.Fees, MainOptions.Fees),
            botBuilder.CardAction.imBack(session, EventOptions.Assignments, MainOptions.Assignments),
            botBuilder.CardAction.imBack(session, EventOptions.Notice, MainOptions.Notice)
        ]);

    session.send(new botBuilder.Message(session)
        .addAttachment(eventCard));


           // botBuilder.Prompts.text(session, "What's your name?");
        
       
    });
bot.dialog('/notice', 
    function(session, args, next){       

const EventOptions = {
    Technical: 'Technical',
    Cultural: 'Cultural',
    };

  
    var eventCard = new botBuilder.HeroCard(session)
        .title('Welcome to GGITS Notice Board')
        .subtitle('Select any of the below Notice for Details!!')
        .images([
            new botBuilder.CardImage(session)
                .url('https://placeholdit.imgix.net/~text?txtsize=56&txt=Contoso%20Flowers&w=640&h=330')
                .alt('Contoso Flowers')
        ])
        .buttons([
            botBuilder.CardAction.imBack(session, EventOptions.Events, MainOptions.Events),
            botBuilder.CardAction.imBack(session, EventOptions.Fees, MainOptions.Fees),
            botBuilder.CardAction.imBack(session, EventOptions.Assignments, MainOptions.Assignments),
            botBuilder.CardAction.imBack(session, EventOptions.Notice, MainOptions.Notice)
        ]);

    session.send(new botBuilder.Message(session)
        .addAttachment(eventCard));


           // botBuilder.Prompts.text(session, "What's your name?");
        
       
    });


var connectorListener = connector.listen();
function listen() {
    return function (req, res) {
        // Capture the url for the hosted application
        // We'll later need this url to create the checkout link 
        var url = req.protocol + '://' + req.get('host');
        siteUrl.save(url);
        connectorListener(req, res);
    };
}

// Other wrapper functions
function beginDialog(address, dialogId, dialogArgs) {
    bot.beginDialog(address, dialogId, dialogArgs)
}

function sendMessage(message) {
    bot.send(message);
}

module.exports = {
    listen: listen,
    beginDialog: beginDialog,
    sendMessage: sendMessage
};


/*
 bot.dialog('/', [
    function(session){
        session.beginDialog('/ensureProfile', session.userData.profile);
    },
    function(session, results){
      session.userData.profile = results.response;
      session.send('Hello %(name)s ! I love %(company)s!', session.userData.profile);
    }
]);

bot.dialog('/ensureProfile', [
    function(session, args, next){
        session.privateConversationData.profile = args || {};
       
            botBuilder.Prompts.text(session, "What's your name?");
        
       
    },
    function(session,results,next){
        if(results.response){
            session.privateConversationData.profile.name = results.response;
        }
        
            botBuilder.Prompts.text(session, "What company do you work for?");
       
    },
    function(session,results){
        if(results.response){
            session.privateConversationData.profile.company = results.response;
        }
        session.endDialogWithResult({ response: session.privateConversationData.profile});
    }
]);

*/