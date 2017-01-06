angular.
module('exploreApp').
component('explore', {
	templateUrl:
	'views/explore.html',
	controller:['$scope','$http','userService',
	function($scope,$http,userService){
		/*	$scope.$watch("$root.online", function(newStatus) {

			$scope.user.is_online=newStatus;
			var temp={is_online:newStatus};
			$http.put("/explore/online/"+$scope.user.id, temp).then(function successCallback(response){
				console.log(response);
			}, function errorCallback(response){
				console.log("backend api error");
			});

		});*/
		$scope.filters={};
		$scope.filters.raw_filter=false;
		$scope.filters.all_filter=true;
		$scope.filters.age_filter=true;
		$scope.filters.friends_filter=true;
		$scope.filters.liked_filter=false;

		console.log("hey from explore controller");

		var last_online=function(){
			$scope.user.last_online=new Date().getTime();
			var temp={last_online:$scope.user.last_online};
			$http.put("/explore/last_online/"+$scope.user.id, temp).then(function successCallback(response){
				console.log(response);
			}, function errorCallback(response){
				console.log("backend api error");
			});
		};
		userService.get(function(data) {
			$scope.user= Object.assign({}, data) ;
			last_online();
			console.log(data);

		});

		//console.log();
		var getAll=function(){
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
		};
		getAll();
		var intervalID = setInterval(function(){
			getAll();
			last_online();
			console.log($scope.user);
		}, 10000);

		$scope.gender_expression=function(thisUser){
			return (($scope.user.looking_gender==thisUser.gender)&&($scope.user.gender==thisUser.looking_gender));
		};

		$scope.all_filter_expression = function(thisUser) {
			return !($scope.user.like_bool)||($scope.user.like_bool.indexOf(thisUser.id)==-1);
		};

		$scope.age_filter_expression = function(thisUser) {
			return ((!$scope.user.looking_age_max)||(!$scope.user.looking_age_min)||((thisUser.age_range.min<=$scope.user.looking_age_max)&&(thisUser.age_range.min>=$scope.user.looking_age_min)));
		};

		$scope.liked_filter_expression = function(thisUser) {
			return true;
		};
		$scope.friends_filter_expression = function(thisUser) {
		var hasId=function(user){
			//console.log(user.id+" =="+thisUser.id+" "+(user.id==thisUser.id));
			return (user.id==thisUser.id);
		};
			//console.log($scope.user.friends.data.find(hasId)!==undefined);
			return !($scope.user.friends)||($scope.user.friends.data.find(hasId)!==undefined);
		};

			var rad= function(x) { return x * Math.PI / 180; };

			  // Distance in kilometers between two points using the Haversine algo.
			  var haversine= function(p1, p2) {
			  	var R = 6371;
			  	var dLat  = rad(p2.latitude - p1.latitude);
			  	var dLong = rad(p2.longitude - p1.longitude);

			  	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
			  	Math.cos(rad(p1.latitude)) * Math.cos(rad(p2.latitude)) * Math.sin(dLong/2) * Math.sin(dLong/2);
			  	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
			  	var d = R * c;
			  	//console.log(Math.round(d));
			  	return Math.round(d);
			  };

			  // Distance between me and the passed position.
			  var distance_between= function(position, position2) {
			  	return haversine(position.coords, position2);
			  };


			var check_distance=function(position){
				$scope.user.location=position;
			};

		$scope.order_location=function(thisUser){
			if ( navigator.geolocation ) { // Check that the browser supports geolocation.
				  // Request current position and provide callbacks.
				  if(thisUser.location=="undefined"){
				  	return 9999999;
				  }else{
				  navigator.geolocation.getCurrentPosition(function(position){
				  	distance_between(position,thisUser.location);
				  });
				}
				  // Keep watching the position and call callbacks on change.
				//  navigator.geolocation.watchPosition(Geolocation.distance_from);
				} else {
				  // Fallback gracefully if geolocation isn't working
				  console.log("not working geo");
				}
				return 99999999;
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
		//console.log($scope.user.matches);
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
					return !($scope.user.like_bool)||($scope.user.like_bool.indexOf(thisUser.id)==-1);
				};
			}
		};
		$scope.all_filter=function(){
			$scope.filters.all_filter=(!$scope.filters.all_filter);
			if($scope.filters.all_filter){
				$scope.filters.raw_filter=false;
				$scope.all_filter_expression = function(thisUser) {
					return !($scope.user.like_bool)||($scope.user.like_bool.indexOf(thisUser.id)==-1);
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
					return ((!$scope.user.looking_age_max)||(!$scope.user.looking_age_min)||((thisUser.age_range.min<=$scope.user.looking_age_max)&&(thisUser.age_range.min>=$scope.user.looking_age_min)));
				};
			}else{
				console.log("off");
				$scope.age_filter_expression = function(thisUser) {
					return true;
				};
			}
		};

		$scope.friends_filter=function(){
			$scope.filters.friends_filter=(!$scope.filters.friends_filter);
			if($scope.filters.friends_filter){
						$scope.friends_filter_expression = function(thisUser) {
		var hasId=function(user){
		//	console.log(user.id+" =="+thisUser.id+" "+(user.id==thisUser.id));
			return (user.id==thisUser.id);
		};
			//console.log($scope.user.friends.data.find(hasId)!==undefined);
			return ($scope.user.friends.data.find(hasId)!==undefined);
		};
			}else{
				$scope.friends_filter_expression = function(thisUser) {
					return true;
				};
			}

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