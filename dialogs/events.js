var util = require('util');
var botBuilder = require('botbuilder');

const library = new botBuilder.Library('events');

var data= 
{
    "events" :[
        {
            "name":"technical",
            "branch":"cs",
            "venue":"cl-10"
        },
        {
            "name":"cultural",
            "branch":"mba",
            "venue":"spandan"
        },
        {
            "name":"robotics",
            "branch":"ec",
            "venue":"cl-09"
        }

    ]
}
library.dialog('/', [
  
    function(session){
       
            botBuilder.Prompts.text(session, "What's your name?");
        
       
    }
]);
