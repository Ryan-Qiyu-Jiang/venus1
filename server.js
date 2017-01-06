var express = require('express');
var app=express();

var mongojs=require('mongojs');
var db=mongojs('venusUsers',['venusUsers']);
var bodyParser=require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
var path = require('path');
var graph = require('fbgraph');
/*
var request = require('request');
var OAuth2 = require('oauth2').OAuth2;
var oauth2 = new OAuth2("344273665958321",
                        "443b1280884670cb185fd59d2aa5731e",
                       "", "https://www.facebook.com/dialog/oauth",
                   "https://graph.facebook.com/oauth/access_token",
                   null);

app.get('/facebook/auth',function (req, res) {
      var redirect_uri = "http://localhost:5000" +    "/";
      // For eg. "http://localhost:3000/facebook/callback"
      var params = {'redirect_uri': redirect_uri, 'scope':'user_about_me,publish_actions'};
      res.redirect(oauth2.getAuthorizeUrl(params));
});
*/
//CONFIG STUFF i'm lazy so its here
var conf = {
	client_id:      '344273665958321'
	, client_secret:  '443b1280884670cb185fd59d2aa5731e'
	, scope:          'email, user_about_me, user_birthday, user_location, user_friends'
	, redirect_uri:   'http://localhost:5000/app'
};
app.get('/auth/facebook', function(req, res) {

  // we don't have a code yet
  // so we'll redirect to the oauth dialog
  if (!req.query.code) {
  	var authUrl = graph.getOauthUrl({
  		"client_id":     conf.client_id
  		, "redirect_uri":  conf.redirect_uri
  		, "scope":         conf.scope
  	});

    if (!req.query.error) { //checks whether a user denied the app facebook login/permissions
    	res.redirect(authUrl);
    } else {  //req.query.error == 'access_denied'
    res.send('access denied');
}
return;
}

  // code is set
  // we'll send that and get the access token
  graph.authorize({
  	"client_id":      conf.client_id
  	, "redirect_uri":   conf.redirect_uri
  	, "client_secret":  conf.client_secret
  	, "code":           req.query.code
  }, function (err, facebookRes) {
  	res.redirect('/UserHasLoggedIn');
  });


});



app.use(express.static(__dirname+'/public'));
app.use (bodyParser.json());


//end of config

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/views/index.html'));
});
//add user to database
app.post('/signup',function(req,res){
	console.log(req.body);
	console.log("got POST");
	db.venusUsers.insert(req.body,function(err,docs){
		res.json(docs);
	})
});
/*
app.get('/login/1192233504204682',function(req,res){
	var id=req.params.id;
	console.log(""+req.params.id);
	db.venusUsers.findOne({id: "1192233504204682"},function(err,docs){
		res.json(docs);
	})
});
*/

app.get('/login/:id',function(req,res){
	var id=req.params.id;
	db.venusUsers.findOne({id: id},function(err,docs){
		res.json(docs);
	})
});

app.put('/user/:id',function(req,res){
	var id=req.params.id;
	db.venusUsers.findAndModify({query: {id: id},
		update: {$set: {first_name: req.body.first_name,
			last_name: req.body.last_name,picture:req.body.picture,
			age_range:req.body.age_range,gender:req.body.gender,
			email:req.body.email,friends:req.body.friends,
			aboutMe:req.body.aboutMe,looking_gender:req.body.looking_gender,
			like_bool:req.body.like_bool,matches:req.body.matches,
			looking_age_min:req.body.looking_age_min, looking_age_max:req.body.looking_age_max,
			location:req.body.location}},
			new:true},function(err,doc){
				res.json(doc);
			}
			)
});
app.put('/explore/like_bool/:id',function(req,res){
	var id=req.params.id;
	db.venusUsers.findAndModify({query:{id:id},
	update:{
		$set:{
			like_bool:req.body.like_bool
		}},new:true},function(err,doc){
			res.json(doc);
		}
	)
});
app.put('/explore/online/:id',function(req,res){
	var id=req.params.id;
	db.venusUsers.findAndModify({query:{id:id},
	update:{
		$set:{
			is_online:req.body.is_online
		}},new:true},function(err,doc){
			res.json(doc);
		}
	)
});

app.put('/explore/last_online/:id',function(req,res){
	var id=req.params.id;
	db.venusUsers.findAndModify({query:{id:id},
	update:{
		$set:{
			last_online:req.body.last_online
		}},new:true},function(err,doc){
			res.json(doc);
		}
	)
});

app.delete('/profile/:id',function(req,res){
	var id=req.params.id;
	db.venusUsers.remove({id:id},function(err,docs){
		res.json(docs);
	})
});

app.put('/explore/matches/:id',function(req,res){
	var id=req.params.id;
	db.venusUsers.findAndModify({query:{id:id},
	update:{
		$set:{
			matches:req.body.matches
		}},new:true},function(err,doc){
			res.json(doc);
		}
	)
});

app.get('/explore',function(req,res){
	db.venusUsers.find({},function(err,docs){
		res.json(docs);
	})
});

app.listen(5000);
console.log("venus server running");

