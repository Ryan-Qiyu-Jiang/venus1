venusApp.service('userService', function ($http) {
	var userProfile="untouched";
	var getUserLocal=function(){

		FB.api('/me', function(response) {
						//console.log('Good to see you, ' + response.name + '.');
						var user=response;
						console.log(response);
						//console.log($scope.user);
						$http.get('/login/'+user.id).then(function successCallback(response) {
					    // this callback will be called asynchronously
					    // when the response is available
					    //might be useful one day
					    userProfile=response.data;
					    console.log(userProfile);

					}, function errorCallback(response) {
					    // called asynchronously if an error occurs
					    // or server returns response with an error status.
					    console.log("service fb.api error");
					});

					});
	};
	function login(callback){
	FB.login(function(response) {
		console.log("2");
		if (response.authResponse) {
			console.log('Welcome!  Fetching your information.... ');

			FB.api('/me', function(response) {
				console.log('Good to see you, ' + response.name + '.');
				var user=response;
				console.log(response);
						//console.log($scope.user);
						$http.get('/login/'+user.id).then(function successCallback(response) {
					    // this callback will be called asynchronously
					    // when the response is available
					    //might be useful one day
					    userProfile=response.data;
					    console.log(userProfile);
					    callback( Object.assign({}, userProfile) );

					}, function errorCallback(response) {
					    // called asynchronously if an error occurs
					    // or server returns response with an error status.
					    console.log("service fb.api error");
					});
						//return userProfile;
					});
		} else {
			console.log('User cancelled login or did not fully authorize.');

		}
					//return userProfile;
				});
};
	return {
		get: function (callback) {
			if(userProfile==="untouched"){
				window.fbAsyncInit = function () {
								FB.init({
									appId      : '344273665958321',
									xfbml      : true,
									version    : 'v2.8'
								});
				    	login(callback);
				};
				(function(d){
					var js, id = 'facebook-jssdk'; if (d.getElementById(id)) {return;}
					js = d.createElement('script'); js.id = id; js.async = true;
					js.src = "//connect.facebook.net/en_US/all.js";
					d.getElementsByTagName('head')[0].appendChild(js);
				}(document));

			} else {
				callback(Object.assign({}, userProfile));
			}

		},
		get_new:function(callback){
			window.fbAsyncInit = function () {
				FB.init({
					appId      : '344273665958321',
					xfbml      : true,
					version    : 'v2.8'
				});



    	login(callback);

};

(function(d){
	var js, id = 'facebook-jssdk'; if (d.getElementById(id)) {return;}
	js = d.createElement('script'); js.id = id; js.async = true;
	js.src = "//connect.facebook.net/en_US/all.js";
	d.getElementsByTagName('head')[0].appendChild(js);
}(document));
},
set: function(value) {
	userProfile = value;
	$http.put('user/'+userProfile.id, userProfile).then(function successCallback(response){
		console.log(response);
	}, function errorCallback(response){
		console.log("backend api error");
	});
	console.log(userProfile);
},
get_easy: function(){
	console.log(userProfile);
},
signup:function(value){
	userProfile = value;
},
		//getUser: function(){
	//		getUserLocal();
		//	return userProfile;
		//},
		getUser:function(callback){
			FB.api('/me', function(response) {
						//console.log('Good to see you, ' + response.name + '.');
						var user=response;
						//console.log(response);
						//console.log($scope.user);
						//return $http.get('/login/'+user.id);

						$http.get('/login/'+user.id).then(function successCallback(response) {
						    // this callback will be called asynchronously
						    // when the response is available

						    userProfile=response.data;
						    console.log(userProfile);
						    callback();
						    return userProfile;
						}, function errorCallback(response) {
						    // called asynchronously if an error occurs
						    // or server returns response with an error status.
						    console.log("service fb.api error");
						});
					});
		}
	};
});
