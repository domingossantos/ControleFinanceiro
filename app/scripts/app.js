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
    'ui.bootstrap',
    'ui.mask',
    'ui.utils.masks',
    'angular-growl',
    'controleFinanceiroApp.controllers',
    'controleFinanceiroApp.resources',
    'controleFinanceiroApp.services'
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
                templateUrl: 'views/movimento/pagamento/incluir.html',
                controller: 'PagamentoIncluirCtrl'
            })
            .when('/movimento/pagamento', {
                templateUrl: 'views/movimento/pagamento/lista_pagamento.html',
                controller: 'PagamentoListaCtrl'
            })
            .when('/movimento/pagamento/:idPagamento', {
                templateUrl: 'views/movimento/pagamento/edicao_pagamento.html',
                controller: 'PagamentoEdicaoCtrl'
            })
            .when('/aplicacao', {
                templateUrl: 'views/movimento/aplicacao/aplicacao.html',
                controller: 'AplicacaoCtrl'
            })
            .when('/movimento/aplicacao', {
                templateUrl: 'views/movimento/aplicacao/lista_aplicacao.html',
                controller: 'AplicacaoCtrl'
            })
            .when('/extrato', {
                templateUrl: 'views/extrato/index.html',
                controller: 'ExtratoCtrl'
            })
            .when('/deposito', {
                templateUrl: 'views/movimento/deposito/deposito.html',
                controller: 'DepositoCtrl'
            })
            .when('/movimento/deposito', {
                templateUrl: 'views/movimento/deposito/lista_deposito.html',
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
            .when('/usuario', {
                templateUrl: 'views/usuario/lista_usuario.html',
                controller: 'UsuarioCtrl'
            })
            .when('/perfil', {
                templateUrl: 'views/perfil/lista_perfil.html',
                controller: 'PerfilCtrl'
            })
            .when('/alterar-senha', {
                templateUrl: 'views/alterar_senha.html',
                controller: 'AlterarSenhaCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });

app.run(['$rootScope', '$location', '$http', 'MessageSrv', 'CookiesSrv', function ($rootScope, $location, $http, MessageSrv, CookiesSrv) {

    $rootScope.showCarregando = false;
    $rootScope.paginaAtual = 0;
    $rootScope.datInicio = null;
    $rootScope.dataFim = null;


    $rootScope.$on('$routeChangeStart', function (angularEvent, next, current) {
        var requireLogin = typeof $rootScope.usuario === 'undefined' || $rootScope.usuario == null;
        if (requireLogin) {
            if($location.path() != '/'){
                MessageSrv.warning('Acesso não autorizado<br>Favor entre com seu e-mail e senha!');
                $location.path('/');
            }
        }

    });


}]);


app.config(['$httpProvider', function ($httpProvider) {
    var myHttpInterceptor = ['$q', '$rootScope', '$location', 'MessageSrv', function ($q, $rootScope, $location, MessageSrv ) {
        return {
            'request': function (request) {
                $rootScope.showCarregando = true;
                return request || $q.when(request);
            },
            'response': function (response) {
                $rootScope.showCarregando = false;
                return response || $q.when(response);
            },
            'responseError': function (response) {
                $rootScope.showCarregando = false;
                MessageSrv.warning('Erro na operação tente novamente<br> Se persistir contate o adminstrador.');
            }
        };
    }];
    $httpProvider.interceptors.push(myHttpInterceptor);
}]);


//app.rootContext = 'http://api.domsantos.com.br:8080/cf-api/';
app.rootContext = 'http://localhost:8080/cf-api/';

angular.module('controleFinanceiroApp.resources',[]);
angular.module('controleFinanceiroApp.controllers',[]);
angular.module('controleFinanceiroApp.services',[]);
angular.module('controleFinanceiroApp.diretives',[]);
