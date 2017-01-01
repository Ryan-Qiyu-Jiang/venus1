angular.
module('exploreApp').
component('explore', {
	templateUrl:
	'views/explore.html',
	controller:['$scope','$http','userService',
	function($scope,$http,userService){
		$scope.filters={};
		$scope.filters.raw_filter=false;
		$scope.filters.all_filter=true;
		$scope.filters.age_filter=true;
		$scope.filters.location_filter=true;
		$scope.filters.liked_filter=false;

		console.log("hey from love controller");
		userService.get(function(data) {
			$scope.user=data;console.log(data);
		});
		//console.log();
		$http.get('/explore').then(function successCallback(response) {
					    // this callback will be called asynchronously
					    // when the response is available
					    //might be useful one day
					    $scope.allUsers=response.data;
					    console.log($scope.allUsers);
					}, function errorCallback(response) {
					    // called asynchronously if an error occurs
					    // or server returns response with an error status.
					    console.log("explore http error");
					});

		$scope.all_filter_expression = function(thisUser) {
			return ($scope.user.like_bool.indexOf(thisUser.id)==-1);
		};

		$scope.age_filter_expression = function(thisUser) {
			return ((thisUser.age_range.min<=$scope.user.looking_age_max)&&(thisUser.age_range.min>=$scope.user.looking_age_min));
		};

		$scope.liked_filter_expression = function(thisUser) {
			return true;
		};

		$scope.likeable=function(user){
		//	var test=[];
		//	console.log(test);
		//	console.log(Array.from($scope.user.like_bool));
		//	console.log(Array.from(user.like_bool));
		var like_bool1=new Set(Array.from($scope.user.like_bool));
		var like_bool2=new Set(Array.from(user.like_bool));
		var matches1=new Set(Array.from($scope.user.matches));
		var matches2=new Set(Array.from(user.matches));
		var temp=like_bool1.has(user.id);
		console.log(temp);
		if(!temp){
			console.log("liked");
			like_bool1.add(user.id);
			console.log(user);
			if(like_bool2.has($scope.user.id)){
				console.log("likes user 1");
				matches1.add(user.id);
				matches2.add($scope.user.id);
				user.matches=Array.from(matches2);
				user.like_bool=Array.from(like_bool2);
				$scope.user.matches=Array.from(matches1);
						//$scope.user.like_bool=Array.from(like_bool1);

						$http.put('/explore/matches/'+user.id, user).then(function successCallback(response){
							console.log(response);
						}, function errorCallback(response){
							console.log("backend api error");
						});
						//userService.set($scope.user);
					}else{console.log("doesn't like user 1");

				}
				$scope.user.like_bool=Array.from(like_bool1);
			}else{
				console.log("unliked");
				like_bool1.delete(user.id);
				if(matches1.has(user.id)){
					matches2.delete($scope.user.id);
					user.matches=Array.from(matches2);
					matches1.delete(user.id);
					$scope.user.matches=Array.from(matches1);
					$http.put('/explore/matches/'+user.id, user).then(function successCallback(response){
						console.log(response);
					}, function errorCallback(response){
						console.log("backend api error");
					});

				}
				$scope.user.like_bool=Array.from(like_bool1);
			}
			userService.set($scope.user);

		};

		$scope.raw_filter=function(){

			$scope.filters.raw_filter=(!$scope.filters.raw_filter);
			if($scope.filters.raw_filter){
				$scope.filters.all_filter=false;
				$scope.all_filter_expression = function(thisUser) {
					return true;
				};
			}else{
				$scope.filters.all_filter=true;
				$scope.all_filter_expression = function(thisUser) {
					return ($scope.user.like_bool.indexOf(thisUser.id)==-1);
				};
			}
		};
		$scope.all_filter=function(){
			$scope.filters.all_filter=(!$scope.filters.all_filter);
			if($scope.filters.all_filter){
				$scope.filters.raw_filter=false;
				$scope.all_filter_expression = function(thisUser) {
					return ($scope.user.like_bool.indexOf(thisUser.id)==-1);
				};
				if($scope.filters.liked_filter){
					$scope.liked_filter();
				}
			}else{
				$scope.filters.raw_filter=true;
				$scope.all_filter_expression = function(thisUser) {
					return true;
				};
			}
		};
		$scope.age_filter=function(){
			$scope.filters.age_filter=(!$scope.filters.age_filter);
			if($scope.filters.age_filter){
				console.log("on");
				$scope.age_filter_expression = function(thisUser) {
					return ((thisUser.age_range.min<=$scope.user.looking_age_max)&&(thisUser.age_range.min>=$scope.user.looking_age_min));
				};
			}else{
				console.log("off");
				$scope.age_filter_expression = function(thisUser) {
					return true;
				};
			}
		};

		$scope.location_filter=function(){
			$scope.filters.location_filter=(!$scope.filters.location_filter);
		};
		$scope.liked_filter=function(){
			$scope.filters.liked_filter=(!$scope.filters.liked_filter);
			if($scope.filters.liked_filter){
				$scope.liked_filter_expression = function(thisUser) {
					return !($scope.user.like_bool.indexOf(thisUser.id)==-1);
				};
				if($scope.filters.raw_filter){

				}else{
					$scope.all_filter();
				}
			}else{
				$scope.all_filter();
				$scope.liked_filter_expression = function(thisUser) {
					return true;
				};
			}


		};

	}]

    //controllerUrl:'../components/login/loginCtrl.controller.js'
});