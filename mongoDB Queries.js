// Use connect method to connect to the Server
/*
MongoClient.connect(url, function(err, db) {
  
  //ensure we've connected
  assert.equal(null, err);
  

  console.log("Connected correctly to server");

  var eventData = db.collection('event_data');

 // obj = eventData.find({"name":"technical"}).toArray();
/*          
          eventData.find({"name":"technical"}).toArray(function(err, doc){
                  // Handle any error
                  if(err){
                      db.close();
                      return console.error(err);
                  }
                 

                  //  console.log(doc[0].name);
                 //   return doc;
          
        });
    
    */
           

/*
  // Insert Data
  eventData.insert({
            "name":"Other",
            "branch":"cs",
            "venue":"cl-01"
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
*/
/*
      // Update Data
      var updateEvent = docs.ops[0];
      updateEvent.venue = "cl 02";

      eventData.update( { _id: new ObjectID(updateEvent._id)},
         updateEvent, {w:1}, function(err, count){
              console.log('updated' + count+ 'documents');
*/
/*            // Read Data 
              eventData.findOne({ _id: new ObjectID(updateEvent._id)}, function(err, doc){
                  // Handle any error
                  if(err){
                      db.close();
                      return console.error(err);
                  }

                  console.log('read 1 item');
                  console.log(doc);
  
    //close the database connection
  
                return db.close();    
          });

          
        } );
      
      

  });
 */

 /*   Map Reduce function to retrieve all data from database 
 
     eventData.mapReduce(function(){

    })
*/
//close the database connection
  
//                return db.close();
//});
