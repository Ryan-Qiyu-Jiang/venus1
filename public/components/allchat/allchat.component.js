angular.
module('allchatApp').
component('allchat', {
	templateUrl:
	'views/allchat.html',
	controller:['$scope','$http','userService',
	function($scope,$http,userService){

		userService.get(function(data) {
			$scope.user=data;
			console.log(data);

		$scope.allchat=[];
		for(var f in $scope.user.matches){
			getChatUsers(f);
		}
		});

		function getChatUsers(f){
			$http.get("/chat/"+$scope.user.matches[f]).then(function successCallback(response){
				//console.log(response);
				var temp=response.data;
				temp.timeStamp=((new Date( temp.last_online)).toLocaleString());
				$scope.allchat.push(temp);
				console.log(allchat);
			}, function errorCallback(response){
				console.log("backend api error");
			});
		}

	}]

    //controllerUrl:'../components/login/loginCtrl.controller.js'
});