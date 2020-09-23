var express = require('express');
var request = require('request');
var fs = require('fs');
//var userData = require('./users.json');
var bodyParser = require('body-parser');
var uniqid = require('uniqid');

var app = express();

var urlencodedParser = bodyParser.urlencoded({ extended: false });

const readJson = fs.readFileSync('./users.json');
let data = JSON.parse(readJson);

app.use(express.static('public'));

// set the view engine to ejs
app.set('view engine', 'ejs');

// index page 
app.get('/', function(req, res) {
    res.render('pages/index', {
        data: data
    });
});

app.post('/', urlencodedParser, function(req, res) {
    const name = req.body.first_name;
    const lastname = req.body.last_name;
    const address = req.body.address;
    const zipcode = req.body.zip_code;
    const phone = req.body.phone_no;
    const id = data.length;
    console.log(id);

    data.push({ id: id , first_name:name , last_name:lastname , address:address , zip_code:zipcode, phone_no:phone});
	fs.writeFileSync('./users.json', JSON.stringify(data, null, 4));
    res.render("pages/index",{data:data});
});

app.get('/adduser', function(req, res) {
    res.render('pages/add');
});

app.get('/edituser/:id', function(req, res) {
    let data = JSON.parse(readJson);
    var user = data[req.params.id];
    console.log(user);
    res.render("pages/edit",{data1:user});
});

app.post('/edituser/:id', urlencodedParser, function(req, res) {
    const id= req.params.id;
    const name = req.body.first_name;
    const lastname = req.body.last_name;
    const address = req.body.address;
    const zipcode = req.body.zip_code;
    const phone = req.body.phone_no; 
    
    data.forEach(function(item){
        if(item.id == id){
            item.first_name = name;
            item.last_name = lastname;
            item.address = address;
            item.zip_code = zipcode;
            item.phone_no = phone;
        }
    });
    res.render("pages/index",{data:data});
});

app.get('/deleteuser/:id', function (req, res) {
    const id= req.params.id;
    for(var i=0; i<data.length; i++) {
        if(data[i].id == id){
            data.splice(i , 1);
            fs.writeFileSync('./users.json', JSON.stringify(data,null,4));
            res.render("pages/index",{data:data});
        }
    }
});

var server = app.listen(8081, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
});

//https://scotch.io/tutorials/use-ejs-to-template-your-node-application
//https://www.tutorialspoint.com/nodejs/nodejs_express_framework.htm