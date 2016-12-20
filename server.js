var express = require('express');
var app=express();

var mongojs=require('mongojs');
var db=mongojs('venusUsers',['venusUsers']);
var bodyParser=require('body-parser');
var path = require('path');

app.use(express.static(__dirname+'/public'));
app.use (bodyParser.json());
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/views/index.html'));
});

app.listen(4000);
console.log("venus server running");

