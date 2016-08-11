'use strict';

/**
 * @ngdoc overview
 * @name controleFinanceiroApp
 * @description
 * # controleFinanceiroApp
 *
 * Main module of the application.
 */
angular
  .module('controleFinanceiroApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize'
  ])
.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    })
    .when('/movimento', {
      templateUrl: 'views/movimento/registro.html',
      controller: 'MovimentoCtrl'
    })
    .when('/conta', {
      templateUrl: 'views/conta/index.html',
      controller: 'ContaCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
});
