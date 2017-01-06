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
	}
	return {
		get: function (callback) {
			if(userProfile==="untouched"){
			/*	FB.getLoginStatus(function(response){
					console.log("logged in");
					if(response.status==="connected"){
						getUserLocal();
						console.log("after getUserLocal()"+userProfile);
						return userProfile;
					}
				});*/
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
			} else {

					callback(Object.assign({}, userProfile));
				}

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
