var express = require("express");
var path = require("path");
var app = express();
var bodyParser = require("body-parser");
var session = require('express-session');
app.listen(8000, function() {
 console.log("listening on port 8000");
});

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/basic_mongoose');

app.use(bodyParser.urlencoded({extended:true}));
app.use(session({secret: 'codingdojorocks'}));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, './static')));
mongoose.connect('mongodb://localhost/basic_mongoose');
mongoose.Promise = global.Promise;

var QuoteSchema = new mongoose.Schema({
    name:{type:String, required:true,minlength:3},
    content:{type:String, required:true,minlength:10},
},{timestamps:true});

mongoose.model("Quote",QuoteSchema);
var Quote = mongoose.model("Quote");


app.get('/', function(req,res){
    if(req.session.errors == null){
        res.render('index',{isError:false, errors:null});
    }else{
        res.render('index',{isError:true, errors:req.session.errors});
    }
    
});

app.get('/quotes',function(req,res){
    Quote.find({},function(err, quotes){
        if(err){
            console.log(err);
            req.session.errors = "you have errors";
            res.redirect('/');
        }else{
            req.session.errors = null;
            res.render('quotes',{quotes:quotes});
        }

    });
})

app.post('/quotes', function(req,res){
    var newQuote = new Quote({name:req.body.name, content:req.body.content});
    newQuote.save(function(err){
        if(err){
            console.log(err);
            req.session.errors = "you have errors";
            res.redirect('/');
        }else{
            res.redirect('quotes');
        }
    })
})