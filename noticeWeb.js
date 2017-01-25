var mongoose = require('mongoose');

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
// var ObjectID = require('mongodb').ObjectID;
  // Connection URL
var url = 'mongodb://127.0.0.1:27017/test';

MongoClient.connect(url, function(err, db) {
  
  //ensure we've connected
  assert.equal(null, err);
  
  console.log("Connected correctly to server");

  var eventData = db.collection('notice_data');
eventData.insert({
            "content":"Other",
            "branch":"cs",
            "date":"cl-01",
            "category":"Imp",
            "validity":"10",
  }, function(err, docs){

      if(err){
          db.close();
          return console.error(err);
      }

      console.log('inserted:');
      for(var i in docs){
          console.log(docs.ops[i]);
      }

 
      console.log('inserted' + docs.ops.length + 'document');

});
