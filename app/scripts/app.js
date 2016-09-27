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
    'ui.mask',
    'ui.utils.masks',
    'growlNotifications',
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
      templateUrl: 'views/movimento/pagamento.html',
      controller: 'PagamentoCtrl'
    })
    .when('/aplicacao', {
      templateUrl: 'views/movimento/aplicacao.html',
      controller: 'AplicacaoCtrl'
    })
    .when('/deposito', {
      templateUrl: 'views/movimento/deposito.html',
      controller: 'DepositoCtrl'
    })
    .when('/conta', {
      templateUrl: 'views/conta/conta_corrente.html',
      controller: 'ContaCorrenteCtrl'
    })
    .when('/resumo', {
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

app.rootContext = 'http://localhost:8080/cf-api/';

angular.module('controleFinanceiroApp.resources',[]);
angular.module('controleFinanceiroApp.controllers',[]);

