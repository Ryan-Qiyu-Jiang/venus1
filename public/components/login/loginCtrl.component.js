angular.
module('loginApp').
component('login', {
	templateUrl:
	'views/login.html',
	controller:['$scope','$http','$location','userService',
	function($scope,$http,$location,userService){
		console.log("hey from login controller");

		var editUser=function(){
			$http.put('/user/'+$scope.user.id,$scope.user).then(function successCallback(response) {
		    // this callback will be called asynchronously
		    // when the response is available
		    getUser();
		    //already update service in gerUser()
		}, function errorCallback(response) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		});

		}

		var getUser=function(){
			FB.api('/me', function(response) {
				console.log('Good to see you, ' + response.name + '.');
				$scope.user=response;
						//console.log($scope.user);
						$http.get('/login/'+$scope.user.id).then(function successCallback(response) {
					    // this callback will be called asynchronously
					    // when the response is available
					    //might be useful one day
					    $scope.user=response.data;
					    /*
					    if($scope.user.gender==="male"){
					    	$scope.user.gender="man";
					    }else{
					    	if($scope.user.gender==="female"){
					    		$scope.user.gender="woman";
					    	}
					    }*/
					    userService.set($scope.user);

					    console.log($scope.user);
					}, function errorCallback(response) {
					    // called asynchronously if an error occurs
					    // or server returns response with an error status.
					});
					});
		}
		$scope.signupButton = function(){
			FB.login(function(response) {
				if (response.authResponse) {
					console.log('Welcome!  Fetching your information.... ');
					FB.api('/me', {fields: 'id,first_name,last_name, picture.width(500).height(500),age_range,gender, email, about, friends'}, function(response) {
						console.log(response);
						$scope.user=response;
						//console.log($scope.user);

						$scope.user.like_bool=new Set();
						$scope.user.like_bool.add($scope.user.id);
						$scope.user.matches=new Set();
						$scope.user.matches.add($scope.user.id);
						if($scope.user.gender==="male"){
							$scope.user.gender="1";
							$scope.user.looking_gender="2";
						}else if($scope.user.gender==="female"){
							$scope.user.gender="2";
							$scope.user.looking_gender="1";
						}

						userService.signup($scope.user);
						$http.post('/signup',$scope.user).then(function successCallback(response) {
							    // this callback will be called asynchronously
							    // when the response is available
							    console.log(response);
							    $location.path( '/profile' );
							   //console.log(response.data);
							}, function errorCallback(response) {
							    // called asynchronously if an error occurs
							    // or server returns response with an error status.
							});
					});
				}
				else {
					console.log('User cancelled login or did not fully authorize.');
				}
			},{scope:'email,user_friends'});

			//FB.api('/me', {fields: 'last_name'}, function(response) {
			//	console.log(response);
			//	console.log("hi2");
			//});
			console.log("end of function");
		};


		$scope.loginButton = function(){
			FB.login(function(response) {
				if (response.authResponse) {
					console.log('Welcome!  Fetching your information.... ');
					//getUser();
					function callback(){
						return function(){
							$location.path( '/profile' );
						}
					}
					userService.getUser(callback());



				} else {
					console.log('User cancelled login or did not fully authorize.');
				}
			});
		};
	}]

    //controllerUrl:'../components/login/loginCtrl.controller.js'
});