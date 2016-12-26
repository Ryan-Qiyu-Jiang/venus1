angular.
module('profileApp').
component('profile', {
	templateUrl:
	'views/profile.html',
	controller:['$scope','$http','userService',

	function($scope,$http,userService){
		console.log("hey from profile controller");
		userService.get(function(data) {
			$scope.user=data;console.log(data);
		});

		$scope.update=function(){
			userService.set($scope.user);
		};
	}]

    //controllerUrl:'../components/login/loginCtrl.controller.js'
});