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
      templateUrl: 'views/login.html',
      controller: 'MainCtrl'
    })
    .when('/main', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    })
    .when('/pagamento', {
      templateUrl: 'views/movimento/pagamento.html',
      controller: 'MovimentoCtrl'
    })
    .when('/aplicacao', {
      templateUrl: 'views/movimento/aplicacao.html',
      controller: 'MovimentoCtrl'
    })
    .when('/deposito', {
      templateUrl: 'views/movimento/deposito.html',
      controller: 'MovimentoCtrl'
    })
    .when('/conta', {
      templateUrl: 'views/conta/index.html',
      controller: 'ContaCtrl'
    })
    .when('/resumo', {
      templateUrl: 'views/balanco/resumo_conta.html',
      controller: 'BalancoCtrl'
    })
    .when('/plano', {
      templateUrl: 'views/planocontas/index.html',
      controller: 'PlanoContaCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
});
