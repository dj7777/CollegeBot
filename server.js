var express= require('express');
var path = require('path');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var notices = require('./routes/notices');
var events = require('./routes/events');

var app = express();
// View Engine

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.engine('html', require('ejs').renderFile);

app.use(express.static(path.join(__dirname, 'client')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use('/', index);
app.use('/api/v1', notices);
app.use('/api/v1', events);

app.listen(3000, function(){
    console.log('server started on port 3000....')
});