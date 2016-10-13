'use strict';
/**
 * @ngdoc overview
 * @name controleFinanceiroApp
 * @description
 * # controleFinanceiroApp
 *
 * Main module of the application.
 */
var app = angular.module('controleFinanceiroApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngMaterial',
    'ui.mask',
    'ui.utils.masks',
    'angular-growl',
    'controleFinanceiroApp.controllers',
    'controleFinanceiroApp.resources'
  ])
  .config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/login.html',



      controller: 'LoginCtrl'
    })
    .when('/main', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    })
    .when('/pagamento', {
      templateUrl: 'views/movimento/pagamento/pagamento.html',
      controller: 'PagamentoCtrl'
    })
    .when('/movimento/pagamento', {
      templateUrl: 'views/movimento/pagamento/lista_pagamento.html',
      controller: 'PagamentoListaCtrl'
    })
    .when('/aplicacao', {
      templateUrl: 'views/movimento/aplicacao.html',
      controller: 'AplicacaoCtrl'
    })
    .when('/extrato', {
      templateUrl: 'views/extrato/index.html',
      controller: 'ExtratoCtrl'
    })
    .when('/deposito', {
      templateUrl: 'views/movimento/deposito.html',
      controller: 'DepositoCtrl'
    })
    .when('/conta', {
      templateUrl: 'views/conta/conta_corrente.html',
      controller: 'ContaCorrenteCtrl'
    })
    .when('/balanco', {
      templateUrl: 'views/balanco/resumo_conta.html',
      controller: 'BalancoCtrl'
    })
    .when('/plano', {
      templateUrl: 'views/planocontas/index.html',
      controller: 'PlanoContaCtrl'
    })
    .when('/obra', {
      templateUrl: 'views/obra/index.html',
      controller: 'ObraCtrl'
    })
    .when('/fornecedor', {
      templateUrl: 'views/fornecedor/index.html',
      controller: 'FornecedorCtrl'
    })
    .when('/alterar-senha', {
      templateUrl: 'views/alterar_senha.html',
      controller: 'AlterarSenhaCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
});

app.run(['$rootScope', '$location', function ($rootScope, $location) {

  $rootScope.$on('$routeChangeStart', function (angularEvent, next, current) {
    var requireLogin = typeof $rootScope.usuario === 'undefined' || $rootScope.usuario == null;
    if (requireLogin) {
      $location.path('/')
    }
  });
}]);

//app.rootContext = 'http://api.domsantos.com.br:8080/cf-api/';
app.rootContext = 'http://localhost:8080/cf-api/';

angular.module('controleFinanceiroApp.resources',[]);
angular.module('controleFinanceiroApp.controllers',[]);
angular.module('controleFinanceiroApp.services',[]);

