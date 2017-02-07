var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://127.0.0.1:27017/test');


// GET TODOS
router.get('/events', function(req, res, next){
    db.event_data.find(function(err, events){
        if(err){
            res.send(err);
        }
        else{
            res.json(events);
        }
    })
});

// GET SINGLE TODO
router.get('/event/:id', function(req, res, next){
    db.event_data.findOne({_id: mongojs.ObjectId(req.params.id)},function(err, event){
        if(err){
            res.send(err);
        }
        else{
            res.json(event);
        }
    })
});

// Save Event
router.post('/event', function(req, res, next){
    var event = req.body;
    if(!event.name){
        res.status(400);
        res.json({
            "error" : "Invalid Data"
        });
    }
    else{
        db.event_data.save(event, function(err, result){
            if(err){
                res.send(err);
            }
            else{
                res.json(result);
            }
        });
    }
});

// Update ToDO

router.put('/notice/:id', function(req, res, next){
    var notice = req.body;
    var updObj = {};
    
        if(notice.text){
        updObj.text = todo.text;
    }

    if(!updObj){
        res.status(400);
        res.json({
            "error" : "Invalid Data"    
        });
    }
    else{
        db.notice.update({
            _id: mongojs.ObjectId(req.params.id)    
        }, updObj, {}, function(err, result){
            if(err){
                res.send(err);
            }
            else{
                res.json(result);
            }
        });
    }

});

// Delete Notice

router.delete('/notice/:id', function(req, res, next){

        db.notice.remove({
            _id: mongojs.ObjectId(req.params.id)    
        },'' , function(err, result){
            if(err){
                res.send(err);
            }
            else{
                res.json(result);
            }
        });
    

});


module.exports = router;