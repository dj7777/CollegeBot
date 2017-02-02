var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://127.0.0.1:27017/test');


// GET TODOS
router.get('/notices', function(req, res, next){
    db.notice.find(function(err, notices){
        if(err){
            res.send(err);
        }
        else{
            res.json(notices);
        }
    })
});

// GET SINGLE TODO
router.get('/notice/:id', function(req, res, next){
    db.notice.findOne({_id: mongojs.ObjectId(req.params.id)},function(err, notice){
        if(err){
            res.send(err);
        }
        else{
            res.json(notice);
        }
    })
});

// Save TODO
router.post('/notice', function(req, res, next){
    var notice = req.body;
    if(!notice.text){
        res.status(400);
        res.json({
            "error" : "Invalid Data"
        });
    }
    else{
        db.notice.save(notice, function(err, result){
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