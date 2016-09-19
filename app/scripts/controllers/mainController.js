'use strict';

/**
 * @ngdoc function
 * @name controleFinanceiroApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the controleFinanceiroApp
 */
angular.module('controleFinanceiroApp.controllers')
  .controller('MainCtrl', ['$rootScope','$scope', '$injector',function ($rootScope, $scope, $injector) {
    $scope.menu = false;

    $scope.login = function(){
      $scope.menu = true;
    };

    $scope.movimentosHomologados =[];
    $scope.movimentosPendentes =[];
    $scope.movimentosNaoHomologados =[];

    $scope.detalheMovimento = {};
    $scope.itens = {};

    $scope.movimentoResources = $injector.get('MovimentoResources');

    $scope.onDetalheMovimento = function(id){
    }

    $scope.onMovimentosPendentes = function(){

      $scope.movimentoResources.query({idCliente: 1, status : 'PENDENTE_HOMOLOGACAO'}).$promise.then(
        function (success) {
          $scope.movimentosPendentes = success.itens;
        }
      );

    };

    $scope.onMovimentosHomologados = function(){

      $scope.movimentoResources.query({idCliente: 1, status : 'HOMOLOGADO'}).$promise.then(
        function (success) {
          $scope.movimentosHomologados = success.itens;
        }
      );

    };

    $scope.onMovimentosNaoHomologados = function(){

      $scope.movimentoResources.query({idCliente: 1, status : 'NAO_HOMOLOGADO'}).$promise.then(
        function (success) {
          $scope.movimentosNaoHomologados = success.itens;
        }
      );
    };

    $scope.onMudarStatus = function(id,status){
      console.log(id);

      $('#modalHomologa').modal('hide');
    }


    $scope.onMovimentosPendentes();
    $scope.onMovimentosHomologados();
    $scope.onMovimentosNaoHomologados();

  }]);
