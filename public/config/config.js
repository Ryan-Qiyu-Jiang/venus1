angular.
  module('venusApp').
  config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');

      $routeProvider.
        when('/', {
          template: '<login></login>'
        }).
        when('/profile', {
          template: '<profile></profile>'
        }).
        when('/explore', {
          template: '<explore></explore>'
        }).
        when('/chat', {
          template: '<allchat></allchat>'
        }).
        otherwise('/');
    }
  ]);