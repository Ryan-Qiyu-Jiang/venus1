angular.
module('loginApp').
component('login', {
	templateUrl:
	'views/login.html',
	controller:['$scope','$http','$location','userService',
	function($scope,$http,$location,userService){
		console.log("hey from login controller");
	window.fbAsyncInit = function() {
    FB.init({
        appId      : '344273665958321',
        xfbml      : true,
        version    : 'v2.8'
    });

  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

  		$scope.login=($location.path() === '/profile');
  		console.log($location.path());
		$scope.alerts=[];
		  $scope.closeAlert = function(index) {
		    $scope.alerts.splice(index, 1);
		  };
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
						$scope.user.like_bool=Array.from($scope.user.like_bool);
						$scope.user.matches=new Set();
						$scope.user.matches.add($scope.user.id);
						$scope.user.matches=Array.from($scope.user.matches);
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
						userService.get(function(data) {
							if (data==null){
								$scope.alerts.push({msg: 'Couldn\'t find you in the system! Sign up first :p'});
							}else{
								$location.path( '/profile' );
							}
						});

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