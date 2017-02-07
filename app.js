var botBuilder = require('botbuilder');
var restify = require('restify');
var siteUrl = require('./site-url');
var mongoose = require('mongoose');
var schedule = require('node-schedule');
// Setup restify server


var fs = require('fs');
var obj;
/*fs.readFile('data.json', 'utf8', function (err, data) {
  if (err) throw err;
  obj = JSON.parse(data);
});
*/

// import the language driver
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
 var ObjectID = require('mongodb').ObjectID;
  // Connection URL
var url = 'mongodb://127.0.0.1:27017/test';

var server = restify.createServer();   
server.listen(process.env.port || process.env.PORT || 3978, function(){
    console.log('%s listening to %s', server.name, server.url);
});

// create the connector

var connector = new botBuilder.ChatConnector({
    appId : process.env.MICROSOFT_APP_ID,
 appPassword : process.env.MICROSOFT_APP_PASSWORD
   
});

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

var date = new Date(2017, 01, 1, 17, 56, 0);

var j = schedule.scheduleJob(date, function(){
    session.beginDialog('/scheduleMessage');
});

});


//bot.library(require('./dialogs/events'));
//bot.library(require('./dialogs/fees'));
//bot.library(require('./dialogs/assignments'));
//bot.library(require('./dialogs/notice'));

const feesRegex = /^fees/i;
const noticeRegex = new RegExp('^(' + MainOptions.Notice + '|notice)', 'i');
const addNoticeRegex = /^addnotice/;
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
            else if(addNoticeRegex.test(text)){
                return session.beginDialog('/addnotice');
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

bot.dialog('/events',function(session, args){       

const EventOptions = {
    All : 'All',
    Technical: 'Technical',
    Cultural: 'Cultural',
    Robotics: 'Robotics'
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
            botBuilder.CardAction.imBack(session, EventOptions.All, EventOptions.All),
            botBuilder.CardAction.imBack(session, EventOptions.Technical, EventOptions.Technical),
            botBuilder.CardAction.imBack(session, EventOptions.Cultural, EventOptions.Cultural),
            botBuilder.CardAction.imBack(session, EventOptions.Robotics, EventOptions.Robotics)
        ]);

    session.send(new botBuilder.Message(session)
        .addAttachment(eventCard));

MongoClient.connect(url, function(err, db) {
  
  //ensure we've connected
  assert.equal(null, err);
  
  console.log("Connected correctly to server");

  var eventData = db.collection('event_data');


if(session.message.text == 'All'){
    session.sendTyping();

  eventData.find().toArray(function(err, doc){
                  // Handle any error
                  if(err){
                      db.close();
                      return console.error(err);
                  }
            if (doc.length == 0){
                session.endDialog("Sorry I do not have much info about the events there");
            }
            var attchments = [];

            for (var i=0;i<doc.length;i++){
                var attachment = new botBuilder.HeroCard(session)
                                   .title('Event Category: '+doc[i].name)
                                    .subtitle('Venue: '+doc[i].venue)                                    
                                    .text('Organizer: \n'+doc[i].branch+'Venue: \n'+ doc[i].venue)                                   
                                    .buttons([                                    
                                         botBuilder.CardAction.openUrl(session, 'https://azure.microsoft.com/en-us/services/functions/', 'Learn More')
                                    ]);
                attchments.push(attachment);
            }

            var msg = new botBuilder.Message(session)
                            .attachmentLayout(botBuilder.AttachmentLayout.carousel)
                            .attachments(attchments);
            session.endDialog(msg);
        });
}
else if(session.message.text == 'Cultural'){
    session.sendTyping();
       
          eventData.find({"name":"cultural"}).toArray(function(err, doc){
                  // Handle any error
                  if(err){
                      db.close();
                      return console.error(err);
                  }

            if (doc.length == 0){
                session.endDialog("Sorry I do not have much info about the events there");
            }
            var attchments = [];

            for (var i=0;i<doc.length;i++){
                var attachment = new botBuilder.HeroCard(session)
                                  .title('Event Category: '+doc[i].name)
                                    .subtitle('Venue: '+doc[i].venue)                                    
                                    .text('Organizer: \n'+doc[i].branch+'Venue: \n'+ doc[i].venue)                                   
                                    .buttons([                                    
                                         botBuilder.CardAction.openUrl(session, 'https://azure.microsoft.com/en-us/services/functions/', 'Learn More')
                                    ]);
                attchments.push(attachment);
            }

            var msg = new botBuilder.Message(session)
                            .attachmentLayout(botBuilder.AttachmentLayout.carousel)
                            .attachments(attchments);
            session.endDialog(msg);
        });
}

if(session.message.text == 'Robotics'){
    session.sendTyping();

            eventData.find({"name":"robotics"}).toArray(function(err, doc){
                  // Handle any error
                  if(err){
                      db.close();
                      return console.error(err);
                  }
        
           if (doc.length == 0){
                session.endDialog("Sorry I do not have much info about the events there");
            }
            var attchments = [];

            for (var i=0;i<doc.length;i++){
                var attachment = new botBuilder.HeroCard(session)
                                  .title('Event Category: '+doc[i].name)
                                    .subtitle('Venue: '+doc[i].venue)                                    
                                    .text('Organizer: \n'+doc[i].branch+'Venue: \n'+ doc[i].venue)                                   
                                    .buttons([                                    
                                         botBuilder.CardAction.openUrl(session, 'https://azure.microsoft.com/en-us/services/functions/', 'Learn More')
                                    ]);
                                    
                attchments.push(attachment);
            }

            var msg = new botBuilder.Message(session)
                            .attachmentLayout(botBuilder.AttachmentLayout.carousel)
                            .attachments(attchments);
            session.endDialog(msg);
        });
}



if(session.message.text == 'Technical'){
    session.sendTyping();
       
                eventData.find({"name":"technical"}).toArray(function(err, doc){
                  // Handle any error
                  if(err){
                      db.close();
                      return console.error(err);
                  }
                 
            if (doc.length == 0){
                session.endDialog("Sorry I do not have much info about the events there");
            }
            var attchments = [];
       
            for (var i=0;i<doc.length;i++){
                var attachment = new botBuilder.HeroCard(session)
                                    .title('Event Category: '+doc[i].name)
                                    .subtitle('Venue: '+doc[i].venue)                                    
                                    .text('Organizer: \n'+doc[i].branch+'Venue: \n'+ doc[i].venue)                                   
                                    .buttons([                                    
                                         botBuilder.CardAction.openUrl(session, 'https://azure.microsoft.com/en-us/services/functions/', 'Learn More')
                                    ]);
                attchments.push(attachment);
                
            }

            var msg = new botBuilder.Message(session)
                            .attachmentLayout(botBuilder.AttachmentLayout.carousel)
                            .attachments(attchments);
            session.endDialog(msg);
                });
     }       
    });
});


bot.dialog('/fees', 
    function(session, args){       

const FeesOptions = {
    mtech: 'M.Tech.',
    be: 'B.E.',
    mca : 'MCA',
    mba: 'MBA',
    };

  
    var eventCard = new botBuilder.HeroCard(session)
        .title('GGITS Fees Section')
        .subtitle('Fees Options!!')
        .images([
            new botBuilder.CardImage(session)
                .url('https://placeholdit.imgix.net/~text?txtsize=56&txt=Contoso%20Flowers&w=640&h=330')
                .alt('Contoso Flowers')
        ])
        .buttons([
            botBuilder.CardAction.imBack(session, FeesOptions.mtech, FeesOptions.mtech),
            botBuilder.CardAction.imBack(session, FeesOptions.be, FeesOptions.be),
            botBuilder.CardAction.imBack(session, FeesOptions.mca, FeesOptions.mca),
            botBuilder.CardAction.imBack(session, FeesOptions.mba, FeesOptions.mba)
        ]);

    session.send(new botBuilder.Message(session)
        .addAttachment(eventCard));

        if(session.message.text == 'mtech' || session.message.text == 'M.Tech.'){
    session.sendTyping();
     //session.send(' Rs. 25000 per year');
     session.endDialog('Rs. 25000/');
    }
     else if(session.message.text == 'B.E.'){
    session.sendTyping();
     //session.send(' Rs. 25000 per year');
     session.endDialog('Rs. 30000/');
    }
    else if(session.message.text == 'MCA'){
    session.sendTyping();
     //session.send(' Rs. 25000 per year');
     session.endDialog('Rs. 25,000/');
    }
    else if(session.message.text == 'MBA'){
    session.sendTyping();
     //session.send(' Rs. 25000 per year');
     session.endDialog('Rs. 27500/');
    }

       
    });
bot.dialog('/notice', 
    function(session, args, next){       

const NoticeOptions = {
    All : 'All',
    CSE: 'CSE',
    MBA: 'MBA',
    MTech:'M.Tech',
    EC:'EC'
    };

  
    var eventCard = new botBuilder.HeroCard(session)
        .title('Welcome to GGITS Notice Board')
        .subtitle('Select any of the below option for Details!!')
        .images([
            new botBuilder.CardImage(session)
                .url('https://placeholdit.imgix.net/~text?txtsize=56&txt=Contoso%20Flowers&w=640&h=330')
                .alt('Contoso Flowers')
        ])
        .buttons([
            botBuilder.CardAction.imBack(session, NoticeOptions.All, NoticeOptions.All),
            botBuilder.CardAction.imBack(session, NoticeOptions.CSE, NoticeOptions.CSE),
            botBuilder.CardAction.imBack(session, NoticeOptions.MBA, NoticeOptions.MBA),
            botBuilder.CardAction.imBack(session, NoticeOptions.MTech, NoticeOptions.MTech),
            botBuilder.CardAction.imBack(session, NoticeOptions.EC, NoticeOptions.EC),
        ]);

    session.send(new botBuilder.Message(session)
        .addAttachment(eventCard));
           // botBuilder.Prompts.text(session, "What's your name?");    
       

           MongoClient.connect(url, function(err, db) {
  
  //ensure we've connected
  assert.equal(null, err);
  
  console.log("Connected correctly to server");

  var noticeData = db.collection('notice');


if(session.message.text == 'All'){
    session.sendTyping();

  noticeData.find().toArray(function(err, doc){
                  // Handle any error
                  if(err){
                      db.close();
                      return console.error(err);
                  }
            if (doc.length == 0){
                session.endDialog("Sorry I do not have much info about the events there");
            }
            var attchments = [];

            for (var i=0;i<doc.length;i++){
                var attachment = new botBuilder.HeroCard(session)
                                   .title('Notice: '+doc[i].text)
                                    .subtitle('Branch: '+doc[i].branch)                                    
                                    .text('Sem: \n '+doc[i].sem+',  Notice Issued: \n'+ doc[i].date)                                   
                                    ;
                attchments.push(attachment);
            }

            var msg = new botBuilder.Message(session)
                            .attachmentLayout(botBuilder.AttachmentLayout.carousel)
                            .attachments(attchments);
            session.endDialog(msg);
        });
}

else if(session.message.text == 'CSE'){
    session.sendTyping();

  noticeData.find({"branch":"CSE"}).toArray(function(err, doc){
                  // Handle any error
                  if(err){
                      db.close();
                      return console.error(err);
                  }
            if (doc.length == 0){
                session.endDialog("Sorry I do not have much info about the events there");
            }
            var attchments = [];

            for (var i=0;i<doc.length;i++){
                var attachment = new botBuilder.HeroCard(session)
                                   .title('Notice: '+doc[i].text)
                                    .subtitle('Branch: '+doc[i].branch)                                    
                                    .text('Sem: \n'+doc[i].sem+', Notice Issued: \n'+ doc[i].date)                                   
                                    ;
                attchments.push(attachment);
            }

            var msg = new botBuilder.Message(session)
                            .attachmentLayout(botBuilder.AttachmentLayout.carousel)
                            .attachments(attchments);
            session.endDialog(msg);
        });
}

else if(session.message.text == 'MBA'){
    session.sendTyping();

  noticeData.find({"branch":"MBA"}).toArray(function(err, doc){
                  // Handle any error
                  if(err){
                      db.close();
                      return console.error(err);
                  }
            if (doc.length == 0){
                session.endDialog("Sorry I do not have much info about the events there");
            }
            var attchments = [];

            for (var i=0;i<doc.length;i++){
                var attachment = new botBuilder.HeroCard(session)
                                   .title('Notice: '+doc[i].text)
                                    .subtitle('Branch: '+doc[i].branch)                                    
                                    .text('Sem: \n'+doc[i].sem+', Notice Issued: \n'+ doc[i].date)                                   
                                    ;
                attchments.push(attachment);
            }

            var msg = new botBuilder.Message(session)
                            .attachmentLayout(botBuilder.AttachmentLayout.carousel)
                            .attachments(attchments);
            session.endDialog(msg);
        });
}

else if(session.message.text == 'M.Tech'){
    session.sendTyping();

  noticeData.find({"branch":"mtech"}).toArray(function(err, doc){
                  // Handle any error
                  if(err){
                      db.close();
                      return console.error(err);
                  }
            if (doc.length == 0){
                session.endDialog("Sorry I do not have much info about the events there");
            }
            var attchments = [];

            for (var i=0;i<doc.length;i++){
                var attachment = new botBuilder.HeroCard(session)
                                   .title('Notice: '+doc[i].text)
                                    .subtitle('Branch: '+doc[i].branch)                                    
                                    .text('Sem: \n'+doc[i].sem+', Notice Issued: \n'+ doc[i].date)                                   
                                    ;
                attchments.push(attachment);
            }

            var msg = new botBuilder.Message(session)
                            .attachmentLayout(botBuilder.AttachmentLayout.carousel)
                            .attachments(attchments);
            session.endDialog(msg);
        });
}

else if(session.message.text == 'EC'){
    session.sendTyping();

  noticeData.find({"branch":"ec"}).toArray(function(err, doc){
                  // Handle any error
                  if(err){
                      db.close();
                      return console.error(err);
                  }
            if (doc.length == 0){
                session.endDialog("Sorry I do not have much info about the events there");
            }
            var attchments = [];

            for (var i=0;i<doc.length;i++){
                var attachment = new botBuilder.HeroCard(session)
                                   .title('Notice: '+doc[i].text)
                                    .subtitle('Branch: '+doc[i].branch)                                    
                                    .text('Sem: \n'+doc[i].sem+', Notice Issued: \n'+ doc[i].date)                                   
                                    ;
                attchments.push(attachment);
            }

            var msg = new botBuilder.Message(session)
                            .attachmentLayout(botBuilder.AttachmentLayout.carousel)
                            .attachments(attchments);
            session.endDialog(msg);
        });
}
           })
           });
    
    
bot.dialog('/addnotice', [
    function(session,args,next){
            if(botBuilder.Prompts.text(session, "Enter Notice in foll. format and seperate each field by ,- \nText, branch,sem,validity,date")){
            next();
          }    
        },
    
    function(session,results,next){
            var str = results.response;
            var arr = str.split(',');
            MongoClient.connect(url, function(err, db) {
        
                //ensure we've connected
                assert.equal(null, err);              
              //  console.log("Connected correctly to server");
                var noticeData = db.collection('notice');
                noticeData.insert({
                        "text":arr[0],
                        "branch" : arr[1],
                        "sem": arr[2],
                        "validity": arr[3],
                        "date" : "26-01-2016"
                });
                next();
           }
        )},

    function(session,results){
            botBuilder.Prompts.text(session, "Notice Added Successfully");
           // console.log("Data Inserted Successfully");
    }
]);


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

/* Scheduling Message  */

/*
var date = new Date(2017, 01, 1, 17, 22, 0);

var j = schedule.scheduleJob(date, function(){
    botBuilder.beginDialog('/scheduleMessage');
});
*/

bot.dialog('/scheduleMessage',function(session, args){
    MongoClient.connect(url, function(err, db) {
  
  //ensure we've connected
  assert.equal(null, err);
  
  console.log("Connected correctly to server");

  var noticeData = db.collection('notice');

  noticeData.find({"branch":"cse"}).toArray(function(err, doc){
                  // Handle any error
                  if(err){
                      db.close();
                      return console.error(err);
                  }
            if (doc.length == 0){
                session.endDialog("Sorry I do not have much info about the events there");
            }
            var attchments = [];

            for (var i=0;i<doc.length;i++){
                var attachment = new botBuilder.HeroCard(session)
                                   .title('Notice: '+doc[i].text)
                                    .subtitle('Branch: '+doc[i].branch)                                    
                                    .text('Sem: \n'+doc[i].sem+', Notice Issued: \n'+ doc[i].date)                                   
                                    ;
                attchments.push(attachment);
            }

            var msg = new botBuilder.Message(session)
                            .attachmentLayout(botBuilder.AttachmentLayout.carousel)
                            .attachments(attchments);
            session.endDialog(msg);
        });


});
})
