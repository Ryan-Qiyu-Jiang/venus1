angular.
module('profileApp').
component('profile', {
	templateUrl:
	'views/profile.html',
	controller:['$scope','$http','userService',

	function($scope,$http,userService){
		console.log("hey from profile controller");

		var geoSuccess = function(position) {
			console.log(position);
			console.log($scope.user);
			$scope.user.location={
				latitude:position.coords.latitude,
				longitude:position.coords.longitude
			}
			console.log($scope.user);
			console.log($scope.user.location.latitude);
			console.log($scope.user.location.longitude);
		};

		userService.get(function(data) {
			$scope.user=data;console.log(data);
			navigator.geolocation.getCurrentPosition(geoSuccess);
		});

		$scope.update=function(){
			userService.set($scope.user);
		};
		$scope.check=function(){
			userService.get_easy();
		};

		$scope.remove=function(){
			$http.delete('/profile/'+$scope.user.id).then(function successCallback(response){
				console.log(response);
				$location.path( '/' );
			}, function errorCallback(response){
				console.log("backend api error");
			});
		}


	}]

    //controllerUrl:'../components/login/loginCtrl.controller.js'
});