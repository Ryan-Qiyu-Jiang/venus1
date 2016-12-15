angular.
  module('venusApp').
  config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');

      $routeProvider.
        when('/', {
          template: '<login></login>'
        }).
        otherwise('/');
    }
  ]);