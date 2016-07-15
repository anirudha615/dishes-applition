var mongoose = require ('mongoose'),
    assert = require ('assert');
    
var pens = require ('../models/dish');
var Verify = require('./verify');   
var express=require('express');
var geoip = require('geoip-lite');
        
var app = express();

var morgan=require('morgan');

var bodyParser=require('body-Parser');

var hostname ='localhost';

var port = 4050;

app.use(morgan('dev'));
    
var abc = express.Router();
    
abc.use(bodyParser.json());
    
abc.route('/')
    
    .get(Verify.verifyOrdinaryUser, function(req,res,next){
    pens.find({},function(err,result){
        if (err) throw err;
        res.json(result);
    });
    })
    
    .post(Verify.verifyOrdinaryUser, function(req,res,next){
    pens.create(req.body,function(err,result){
        if (err) throw err;
        console.log('Dish Created');
        var id = result._id;
        res.writeHead(200,{'Content-Type':'Text/plain'});
        res.end('Dish created with id:' +id);
            
       
    });
    })
    
    
    .delete(Verify.verifyOrdinaryUser, function(req,res,next){
    pens.remove({},function(err,result){
        if (err) throw err;
        res.json(result);
    });
    });

abc.route('/:dishID')

    
    .get(function(req,res,next){
    pens.findById(req.params.dishID,function(err,result){
        if (err) throw err;
        res.json(result);
    });
    })

   .put(function(req,res,next){
   pens.findByIdAndUpdate(req.params.dishID,{$set : req.body},{new : true})
   .exec(function(err,result){
       if (err) throw err;
       res.json(result);
   });
    })

    .delete(function(req,res,next){
    pens.remove(req.params.dishID,function(err,result){
        if (err) throw err;
        res.json(result);
    });
    });

    abc.route('/:dishID/comments')

    .get(function(req,res,next){
        pens.findById(req.params.dishID, function(err, result){
            if (err) throw err;
            res.json(result.comments);
            
        });
    })
    
    .post(function(req,res,next){
        pens.findById(req.params.dishID, function(err,result){
            if (err) throw err;
            
            result.comments.push(req.body);
            result.save(function(err,result){
                if (err) throw err;
                console.log("updated");
                res.json(result);
            });
        });
    })
    
    .delete(function(req,res,next){
        pens.findById(req.params.dishID, function(err,result){
            if (err) throw err;
            
            for (var i =(result.comments.length-1); i>=0 ; i--){
            result.comments.id(result.comments[i]._id).remove();}
                
                result.save(function(err,result){
                    if (err) throw err;
                    
                    res.writeHead(200,{'content-type' : 'Text/plain'});
                    res.end('Deleted the comments');
                    
                });
            
        });
    });
    
    
    abc.route('/:dishID/comments/:commentID')
    
    .get(function(req,res,next){
        pens.findById(req.params.dishID,function(err,result){
            if (err) throw err;
            res.json(result.comments.id(req.params.commentID));
        });
    })
   
   .put(function(req,res,next){
       pens.findById(req.params.dishID,function(err,result){
           if (err) throw err;
           
           result.comments.id(req.params.commentID).remove();
           
           result.comments.push(req.body);
           result.save(function(err,result){
               if (err) throw err;
               res.json(result);
           });
       });
   })
   
   .delete(function(req, res,next){
       pens.findById(req.params.dishID,function(err,result){
           if (err) throw err;
           
           result.comments.id(req.params.commentID).remove();
           
           result.save(function(err,result){
               if (err) throw err;
               res.json(result);
           });
       });
   });
   app.use('/dishes',abc);


app.use(express.static(__dirname + '/public'));

app.listen(port,hostname,function(){
    console.log('server running on port 2000');
});

module.exports = abc;